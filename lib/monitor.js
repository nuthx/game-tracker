import { getBasicPresence } from "psn-api"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import { getAuthorization } from "@/lib/auth"

// 测试用例
// 1. 空数据库 -> 在线: 记录新在线数据
// 2. 空数据库 -> 游戏A: 记录新游戏A数据
// 3. 上条数据为在线 -> 在线: 更新在线数据
// 4. 上条数据为在线 -> 游戏A: 记录新游戏A数据
// 5. 上条数据为在线 -> 离线: 不操作
// 6. 上条数据为游戏A -> 在线: 记录新在线数据
// 7. 上条数据为游戏A -> 游戏A: 更新游戏A数据
// 8. 上条数据为游戏A -> 游戏B: 记录新游戏B数据
// 9. 上条数据为游戏A -> 离线: 不操作

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
            playTime: Math.floor((new Date() - new Date(lastRecord.startAt)) / 1000 / 60)
          }
        })
      } else {
        await prisma.psnRecord.create({ data: { state: "online" } })
      }
      logger(`用户 ${user.monitorId} 在线，但未在游戏中`)
      return
    }

    // 如果是同一游戏则更新，否则创建新记录
    if (lastRecord?.npTitleId === game.npTitleId) {
      await prisma.psnRecord.update({
        where: { id: lastRecord.id },
        data: {
          endAt: new Date(),
          playTime: Math.floor((new Date() - new Date(lastRecord?.startAt)) / 1000 / 60)
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
          conceptIconUrl: game?.conceptIconUrl || game?.npTitleIconUrl || ""
        }
      })
    }
    logger(`用户 ${user.monitorId} 正在游玩: [${game.launchPlatform} - ${game.npTitleId}] ${game.titleName}`)
  } catch (error) {
    logger(error, "error")
  }
}
