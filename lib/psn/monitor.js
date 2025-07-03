import { logger } from "@/lib/logger"
import { prisma, defaultPlatforms } from "@/lib/prisma"
import { getPsnPresence } from "@/lib/psn/presence"

/* 导入规则
 * 1. 相同游戏游玩时间间隔小于两分钟，算作一条记录
 */

export async function psnMonitor() {
  try {
    const config = await prisma.config.findUnique({ where: { id: 1 } })
    const presence = await getPsnPresence(config)

    // 检查是否登录
    if (presence.status === 401) {
      logger("请先登录账号")
      return
    }

    // 检查是否离线
    if (presence.status === 0) {
      logger(`${config.psnMonitorToName} 已离线`)
      return
    }

    // 检查是否在线，但不在游戏中
    if (presence.status === 1) {
      logger(`${config.psnMonitorToName} 在线，但未在游戏中`)
      return
    }

    // 检查平台是否存在
    const platform = presence.gamePlatform === "PS4" ? defaultPlatforms[0] : defaultPlatforms[1]
    await prisma.platform.upsert({
      where: { uname: platform.uname },
      create: platform,
      update: {}
    })

    // 检查游戏是否存在
    const game = await prisma.game.upsert({
      where: { utitle: presence.gameTitle },
      create: {
        utitle: presence.gameTitle,
        title: presence.gameTitle,
        titleAlias: presence.gameTitle,
        imageIcon: presence.gameIcon,
        platform: {
          connect: [{ uname: platform.uname }]
        }
      },
      update: {
        platform: {
          connect: [{ uname: platform.uname }]
        }
      }
    })

    // 获取最后一条记录
    const lastRecord = await prisma.record.findFirst({
      where: {
        game: {
          utitle: game.utitle
        }
      },
      orderBy: { endAt: "desc" },
      include: {
        game: true
      }
    })

    // 相同游戏且时间小于2分钟，则判定持续游玩，否则为新的记录
    if (lastRecord?.game?.utitle === game.utitle && Math.floor((new Date() - new Date(lastRecord.endAt)) / 1000) < 120) {
      await prisma.record.update({
        where: { id: lastRecord.id },
        data: {
          endAt: new Date(),
          playSeconds: Math.floor((new Date() - new Date(lastRecord.startAt)) / 1000)
        }
      })
    } else {
      await prisma.record.create({
        data: {
          platform: {
            connect: { uname: platform.uname }
          },
          game: {
            connect: { utitle: game.utitle }
          },
          player: config.psnMonitorToName
        }
      })
    }
    logger(`${config.psnMonitorToName} 正在游玩: [${platform.uname} - ${presence.gameId}] ${game.utitle}`)
  } catch (error) {
    logger(error, "error")
  }
}
