import { prisma } from "@/lib/prisma"
import { sendResponse } from "@/lib/http/response"

const MAX_WEEKS = 66
const MAX_RECORDS = MAX_WEEKS * 7

export async function GET(request) {
  try {
    const records = await prisma.record.findMany({
      include: {
        platform: true
      }
    })

    // 创建Map存储每日总计
    const dailyMap = new Map()

    // 添加记录到Map
    records.forEach((record) => {
      const date = record.startAt.toISOString().split("T")[0]
      if (!dailyMap.has(date)) {
        dailyMap.set(date, new Map())
      }
      const platformMap = dailyMap.get(date)
      const platform = record.platform.name
      platformMap.set(platform, (platformMap.get(platform) || 0) + record.playSeconds)
    })

    // 将Map转换为新的数组结构
    let formattedData = Array.from(dailyMap.entries()).map(([date, platformMap]) => {
      const playtime = Array.from(platformMap.entries())
        .map(([platform, value]) => ({
          platform,
          value
        }))
        .filter((item) => item.value > 0) // 只包含有游戏时间的平台

      const totalValue = playtime.reduce((sum, item) => sum + item.value, 0)

      return {
        date,
        playtime,
        total: {
          value: totalValue
        }
      }
    })

    // 填充空白日期
    const today = new Date()
    let fillDate = new Date(today)
    let daysToFill = MAX_RECORDS

    while (daysToFill > 0) {
      const dateStr = fillDate.toISOString().split("T")[0]
      if (!formattedData.find((d) => d.date === dateStr)) {
        formattedData.push({
          date: dateStr,
          playtime: [],
          total: { value: 0 }
        })
      }
      fillDate.setDate(fillDate.getDate() - 1)
      daysToFill--
    }

    // 按日期升序排序，并限制为MAX_RECORDS条记录
    formattedData = formattedData.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-MAX_RECORDS)

    // 计算最大值和最小值
    const totalMetrics = formattedData.reduce(
      (acc, d) => ({
        min: Math.min(acc.min, d.total.value),
        max: Math.max(acc.max, d.total.value)
      }),
      { min: Infinity, max: -Infinity }
    )

    // 在每日中计算并添加百分比
    const getPercent = (value, min, max) => min === max ? 0 : Math.round(((value - min) / (max - min)) * 100)
    const transformedData = formattedData.map((item) => ({
      ...item,
      total: {
        ...item.total,
        percent: getPercent(item.total.value, totalMetrics.min, totalMetrics.max)
      }
    }))

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
