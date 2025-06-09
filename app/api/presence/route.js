import { getBasicPresence } from "psn-api"
import { prisma } from "@/lib/prisma"
import { getAuthorization } from "@/lib/auth"
import { sendResponse } from "@/lib/http/response"

export async function GET(request) {
  try {
    const user = await prisma.user.findUnique({ where: { id: 1 } })

    if (!user.npsso) {
      throw { code: 400, message: "请先登录PSN账号" }
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
        monitorUser: {
          name: user.monitorName,
          avatar: user.monitorAvatar
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
