import { prisma } from "@/lib/prisma"
import { sendResponse } from "@/lib/http/response"

const MAX_WEEKS = 66
const MAX_RECORDS = MAX_WEEKS * 7

export async function GET(request) {
  try {
    const psnRecords = await prisma.psnRecord.findMany({})
    const nxRecords = await prisma.nxRecord.findMany({})

    // 创建Map存储每日总计
    const dailyMap = new Map()

    // 添加PSN记录到Map
    psnRecords.forEach((record) => {
      const date = record.startAt.toISOString().split("T")[0]
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { psn: 0, nx: 0 })
      }
      dailyMap.get(date).psn += record.playSeconds
    })

    // 添加NX记录到Map
    nxRecords.forEach((record) => {
      const date = record.startAt.toISOString().split("T")[0]
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { psn: 0, nx: 0 })
      }
      dailyMap.get(date).nx += record.playSeconds
    })

    // 将Map转换为数组
    let formattedData = Array.from(dailyMap.entries()).map(([date, data]) => ({ date, psn: data.psn, nx: data.nx }))

    // 从今天开始往前填充共MAX_RECORDS条数据
    const today = new Date()
    let fillDate = new Date(today)
    let daysToFill = MAX_RECORDS

    while (daysToFill > 0) {
      const dateStr = fillDate.toISOString().split("T")[0]
      if (!formattedData.find((d) => d.date === dateStr)) {
        formattedData.push({ date: dateStr, psn: 0, nx: 0 })
      }
      fillDate.setDate(fillDate.getDate() - 1)
      daysToFill--
    }

    // 按日期升序排序，并限制为MAX_RECORDS条记录
    formattedData = formattedData.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-MAX_RECORDS)

    // 计算所有记录的最小/最大值
    const metrics = formattedData.reduce((acc, d) => {
      const total = d.psn + d.nx
      return {
        psn: { min: Math.min(acc.psn.min, d.psn), max: Math.max(acc.psn.max, d.psn) },
        nx: { min: Math.min(acc.nx.min, d.nx), max: Math.max(acc.nx.max, d.nx) },
        total: { min: Math.min(acc.total.min, total), max: Math.max(acc.total.max, total) }
      }
    }, {
      psn: { min: Infinity, max: -Infinity },
      nx: { min: Infinity, max: -Infinity },
      total: { min: Infinity, max: -Infinity }
    })

    // 配置计算百分比的函数用于下一步计算
    const getPercent = (value, min, max) => min === max ? 0 : Math.round(((value - min) / (max - min)) * 100)

    // 在游戏记录数据中添加百分比
    const transformedData = formattedData.map((item) => {
      return {
        date: item.date,
        psn: {
          value: item.psn,
          percent: getPercent(item.psn, metrics.psn.min, metrics.psn.max)
        },
        nx: {
          value: item.nx,
          percent: getPercent(item.nx, metrics.nx.min, metrics.nx.max)
        },
        total: {
          value: item.psn + item.nx,
          percent: getPercent(item.psn + item.nx, metrics.total.min, metrics.total.max)
        }
      }
    })

    // 找到第一个星期日作为起点
    const startDate = new Date(transformedData[0].date)
    startDate.setDate(startDate.getDate() + (7 - startDate.getDay()) % 7)

    // 按周分组数据
    const weeklyData = []
    let currentWeek = []

    // 只处理 startDate 之后的数据
    const validData = transformedData.filter((d) => new Date(d.date) >= startDate)
    for (const dayData of validData) {
      const date = new Date(dayData.date)
      if (date.getDay() === 0 && currentWeek.length > 0) {
        weeklyData.push(currentWeek)
        currentWeek = []
      }
      currentWeek.push(dayData)
    }

    // 添加最后一周的数据（如果最后一周还没到周日则不会被添加到weeklyData，需要手动添加）
    if (currentWeek.length > 0) {
      weeklyData.push(currentWeek)
    }

    return sendResponse(request, {
      data: weeklyData
    })
  } catch (error) {
    return sendResponse(request, {
      code: error.code || 500,
      message: error.message
    })
  }
}
