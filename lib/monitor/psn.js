import { getBasicPresence } from "psn-api"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import { getAuthorization } from "@/lib/auth"

// 测试用例
// 01. 空数据库 -> 在线: 记录新在线数据
// 02. 空数据库 -> 游戏A: 记录新游戏A数据
// 03. 上条数据为在线 -> 在线: 更新在线数据
// 04. 上条数据为在线 -> 游戏A: 记录新游戏A数据
// 05. 上条数据为在线 -> 离线: 不操作
// 06. 上条数据为游戏A -> 在线: 记录新在线数据
// 07. 上条数据为游戏A -> 游戏A: 更新游戏A数据
// 08. 上条数据为游戏A -> 游戏A（间隔超过2分钟）: 记录新游戏A数据
// 09. 上条数据为游戏A -> 游戏B: 记录新游戏B数据
// 10. 上条数据为游戏A -> 离线: 不操作

export async function psnMonitor() {
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
    const lastRecord = await prisma.psnRecord.findFirst({ orderBy: { endAt: "desc" } })

    // 获取当前状态
    const isGaming = presence.basicPresence.gameTitleInfoList?.length > 0
    const game = isGaming ? presence.basicPresence.gameTitleInfoList[0] : null

    // 如果上一条是在线记录则更新，否则创建新记录
    if (!isGaming) {
      if (lastRecord?.state === "online") {
        await prisma.psnRecord.update({
          where: { id: lastRecord.id },
          data: {
            endAt: new Date(),
            playSeconds: Math.floor((new Date() - new Date(lastRecord.startAt)) / 1000)
          }
        })
      } else {
        await prisma.psnRecord.create({
          data: {
            state: "online",
            userId: user.monitorId,
            userName: user.monitorName
          }
        })
      }
      logger(`用户 ${user.monitorId} 在线，但未在游戏中`)
      return
    }

    // 如果是同一游戏，检查时间间隔，小于2分钟则更新，否则创建新记录
    if (lastRecord?.npTitleId === game.npTitleId && Math.floor(Math.abs(new Date() - new Date(lastRecord.endAt)) / 1000) < 120) {
      await prisma.psnRecord.update({
        where: { id: lastRecord.id },
        data: {
          endAt: new Date(),
          playSeconds: Math.floor((new Date() - new Date(lastRecord.startAt)) / 1000)
        }
      })
    } else {
      await prisma.psnRecord.create({
        data: {
          state: "gaming",
          npTitleId: game.npTitleId.toUpperCase(),
          titleName: game.titleName,
          format: game.format.toUpperCase(),
          launchPlatform: game.launchPlatform.toUpperCase(),
          conceptIconUrl: game?.conceptIconUrl || game?.npTitleIconUrl || "",
          userId: user.monitorId,
          userName: user.monitorName
        }
      })
    }
    logger(`用户 ${user.monitorId} 正在游玩: [${game.launchPlatform} - ${game.npTitleId}] ${game.titleName}`)
  } catch (error) {
    logger(error, "error")
  }
}
