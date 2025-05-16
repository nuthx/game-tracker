import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import { importRecords } from "@/lib/import"
import { sendResponse } from "@/lib/http/response"

export async function POST(request) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")
    const jsonData = await request.json()
    let importResult = { success: 0, skipped: 0, failed: 0 }

    // 整理游戏记录
    const records = []
    const targetUser = jsonData.users.find((user) => user.id === userId)
    for (const title of targetUser.titles) {
      const gameId = title.id
      const gameName = title.name
      const gameCoverUrl = `https://tinfoil.media/ti/${gameId}/800/800`
      const userName = targetUser.name

      let focusStartTime = null

      for (let i = 0; i < title.events.length; i++) {
        const event = title.events[i]

        // 找到Gained Focus作为开始时间
        if (event.type === "Gained Focus") {
          focusStartTime = new Date(event.clockTimestamp * 1000)
        }

        // 找到Lost Focus事件作为结束时间
        if (event.type === "Lost Focus" && focusStartTime) {
          const focusEndTime = new Date(event.clockTimestamp * 1000)
          const playSeconds = Math.floor((focusEndTime - focusStartTime) / 1000)

          // 只添加30秒以上的记录
          if (playSeconds >= 30) {
            records.push({
              gameId,
              gameName,
              gameCoverUrl,
              userId,
              userName,
              startAt: focusStartTime,
              endAt: focusEndTime,
              playSeconds
            })
          }

          focusStartTime = null
        }
      }
    }

    // 保存到数据库
    await importRecords("nxRecord", records, importResult, (record) => ({
      userId: record.userId,
      gameId: record.gameId,
      startAt: record.startAt,
      endAt: record.endAt
    }))

    return sendResponse(request, {
      data: importResult
    })
  } catch (error) {
    return sendResponse(request, {
      code: error.code || 500,
      message: error.message
    })
  }
}
