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

      // 提取单个游戏记录
      let tempRecords = []
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
            tempRecords.push({
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

      // 合并时间小于2分钟的连续游戏记录
      const mergedRecords = []
      let currentRecord = tempRecords[0]
      for (let i = 1; i < tempRecords.length; i++) {
        const nextRecord = tempRecords[i]
        const timeDiff = (nextRecord.startAt - currentRecord.endAt) / 1000 / 60

        if (timeDiff <= 2) {
          currentRecord.endAt = nextRecord.endAt
          currentRecord.playSeconds += nextRecord.playSeconds
        } else {
          mergedRecords.push(currentRecord)
          currentRecord = nextRecord
        }
      }

      // 添加最后一个记录
      if (currentRecord) {
        mergedRecords.push(currentRecord)
      }

      records.push(...mergedRecords)
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
