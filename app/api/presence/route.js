import { getBasicPresence } from "psn-api"
import { prisma } from "@/lib/prisma"
import { getAuthorization } from "@/lib/auth"
import { sendResponse } from "@/lib/http/response"
import { tf } from "@/lib/utils"

export async function GET(request) {
  try {
    const user = await prisma.user.findUnique({ where: { id: 1 } })

    if (!user.npsso) {
      return sendResponse(request, {
        code: 400,
        message: "请先登录PSN账号"
      })
    }

    const authorization = await getAuthorization()
    const presence = await getBasicPresence(authorization, user.monitorId)

    // 计算游戏时长
    let playSeconds = 0
    if (presence.basicPresence.gameTitleInfoList?.length) {
      const lastRecord = await prisma.psnRecord.findFirst({ orderBy: { endAt: "desc" } })
      playSeconds = lastRecord.playSeconds
    }

    return sendResponse(request, {
      data: {
        ...presence.basicPresence,
        playSeconds,
        playTime: tf(playSeconds)
      }
    })
  } catch (error) {
    return sendResponse(request, {
      code: 500,
      message: error.message
    })
  }
}
