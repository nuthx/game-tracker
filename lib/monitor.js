import { getBasicPresence } from "psn-api"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import { getAuthorization } from "@/lib/auth"

export async function monitorUser() {
  try {
    // 检查是登录PSN账号
    const user = await prisma.user.findUnique({ where: { id: 1 } })
    if (!user.npsso) {
      logger("NPSSO未设置", "error")
      return
    }

    // 获取用户状态
    const authorization = await getAuthorization()
    const presence = await getBasicPresence(authorization, user.monitorId)

    // 检查是否离线
    if (presence.basicPresence.availability === "unavailable") {
      logger(`用户 ${user.monitorId} 已离线`)
      return
    }

    // 获取最后一条记录
    const lastRecord = await prisma.psnRecord.findFirst({ orderBy: { id: "desc" } })

    // 检查是否正在游玩
    if (!presence.basicPresence.gameTitleInfoList?.length) {
      await prisma.psnRecord.upsert({
        where: {
          id: lastRecord?.id ?? -1
        },
        create: {
          state: "online"
        },
        update: {
          endAt: new Date(),
          playTime: Math.floor((new Date() - new Date(lastRecord?.startAt)) / 1000 / 60)
        }
      })
      logger(`用户 ${user.monitorId} 在线，但未在游戏中`)
      return
    }

    // 当前游玩的游戏
    const game = presence.basicPresence.gameTitleInfoList[0]
    logger(`用户 ${user.monitorId} 正在游玩: [${game.launchPlatform} - ${game.npTitleId}] ${game.titleName}`)

    // 如果还是同一款游戏，则只修改时间
    if (game.npTitleId === lastRecord.npTitleId) {
      await prisma.psnRecord.update({
        where: { id: lastRecord.id },
        data: {
          endAt: new Date(),
          playTime: Math.floor((new Date() - new Date(lastRecord.startAt)) / 1000 / 60)
        }
      })
      return
    }

    // 如果刚进入游戏或换了游戏，则新增记录
    await prisma.psnRecord.create({
      data: {
        state: "gaming",
        npTitleId: game.npTitleId.toUpperCase(),
        titleName: game.titleName,
        format: game.format.toUpperCase(),
        launchPlatform: game.launchPlatform.toUpperCase(),
        conceptIconUrl: game?.conceptIconUrl || game?.npTitleIconUrl || ""
      }
    })
  } catch (error) {
    logger(error, "error")
  }
}
