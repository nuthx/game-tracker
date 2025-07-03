import { prisma } from "@/lib/prisma"
import { sendResponse } from "@/lib/http/response"
import { getPsnPresence } from "@/lib/psn/presence"

export async function GET(request) {
  try {
    const config = await prisma.config.findUnique({ where: { id: 1 } })
    const presence = await getPsnPresence(config)

    // 如果在游戏中，则计算当前游戏时长
    let playSeconds = 0
    if (presence.status === 2) {
      const lastRecord = await prisma.record.findFirst({
        where: {
          game: {
            utitle: presence.gameTitle
          }
        },
        orderBy: { endAt: "desc" }
      })
      playSeconds = lastRecord.playSeconds
    }

    return sendResponse(request, {
      data: {
        ...presence,
        playerName: config.psnMonitorToName,
        playerAvatar: config.psnMonitorToAvatar,
        playSeconds
      }
    })
  } catch (error) {
    return sendResponse(request, {
      code: error.code || 500,
      message: error.message
    })
  }
}
