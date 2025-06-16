import { getBasicPresence } from "psn-api"
import { prisma } from "@/lib/prisma"
import { getAuthorization } from "@/lib/auth"
import { sendResponse } from "@/lib/http/response"

export async function GET(request) {
  try {
    const config = await prisma.config.findUnique({ where: { id: 1 } })

    if (!config.psnNpsso) {
      throw { code: 400, message: "请先登录PSN账号" }
    }

    const authorization = await getAuthorization()
    const presence = await getBasicPresence(authorization, config.psnMonitorFromId)

    // 如果在游戏中，则计算当前游戏时长
    let playSeconds = 0
    if (presence.basicPresence.gameTitleInfoList?.length) {
      const lastRecord = await prisma.record.findFirst({ orderBy: { endAt: "desc" } })
      playSeconds = lastRecord.playSeconds
    }

    return sendResponse(request, {
      data: {
        ...presence.basicPresence,
        player: {
          name: config.psnMonitorFromName,
          avatar: config.psnMonitorFromAvatar,
          playSeconds
        }
      }
    })
  } catch (error) {
    return sendResponse(request, {
      code: error.code || 500,
      message: error.message
    })
  }
}
