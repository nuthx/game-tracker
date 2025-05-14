import { prisma } from "@/lib/prisma"
import { sendResponse } from "@/lib/http/response"
import { tf } from "@/lib/utils"

export async function GET(request) {
  try {
    const psnRecords = await prisma.psnRecord.findMany({ orderBy: { endAt: "desc" } })
    const nxRecords = await prisma.nxRecord.findMany({ orderBy: { endAt: "desc" } })

    // 合并并格式化两种记录
    const combinedRecords = [
      ...psnRecords.map((record) => ({
        state: record.state,
        name: record.titleName,
        platform: record.launchPlatform,
        cover: record.conceptIconUrl,
        startAt: record.startAt,
        endAt: record.endAt,
        playSeconds: record.playSeconds,
        playTime: tf(record.playSeconds)
      })),
      ...nxRecords.map((record) => ({
        state: record.state,
        name: record.gameName,
        platform: record.gamePlatform,
        cover: record.gameCoverUrl,
        startAt: record.startAt,
        endAt: record.endAt,
        playSeconds: record.playSeconds,
        playTime: tf(record.playSeconds)
      }))
    ].sort((a, b) => new Date(b.endAt) - new Date(a.endAt))

    return sendResponse(request, {
      data: combinedRecords
    })
  } catch (error) {
    return sendResponse(request, {
      code: error.code || 500,
      message: error.message
    })
  }
}
