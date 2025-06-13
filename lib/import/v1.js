import { prisma, defaultPlatforms } from "@/lib/prisma"

export async function importV1(jsonData, result) {
  try {
    // 创建前三个平台
    const platformMap = new Map()
    for (const defaultPlatform of defaultPlatforms.slice(0, 3)) {
      try {
        const platform = await prisma.platform.upsert({
          where: { uname: defaultPlatform.uname },
          create: defaultPlatform,
          update: {}
        })
        platformMap.set(defaultPlatform.uname, platform)
      } catch {
        result.failedPlatform++
      }
    }

    if (jsonData.records.psn?.length > 0) {
      // 创建游戏
      const gameMap = new Map()
      for (const record of jsonData.records.psn) {
        if (record.state === "online") continue // 跳过在线状态
        const platform = platformMap.get(record.launchPlatform)
        try {
          const game = await prisma.game.upsert({
            where: { title: record.titleName },
            create: {
              title: record.titleName,
              titleAlias: record.titleName,
              imageIcon: record.conceptIconUrl,
              platform: {
                connect: [{ id: platform.id }]
              }
            },
            update: {
              platform: {
                connect: [{ id: platform.id }]
              }
            }
          })
          gameMap.set(record.titleName, game)
        } catch (error) {
          console.log(error)
          result.failedGame++
        }
      }

      // 创建记录
      for (const record of jsonData.records.psn) {
        if (record.state === "online") continue // 跳过在线状态
        const platform = platformMap.get(record.launchPlatform)
        const game = gameMap.get(record.titleName)
        try {
          await prisma.record.upsert({
            where: {
              startAt_endAt: {
                startAt: record.startAt,
                endAt: record.endAt
              }
            },
            create: {
              platformId: platform.id,
              gameId: game.id,
              player: record.userName,
              startAt: record.startAt,
              endAt: record.endAt,
              playSeconds: record.playSeconds
            },
            update: {}
          })
        } catch (error) {
          console.log(error)
          result.failedRecord++
        }
      }
    }

    if (jsonData.records.nx?.length > 0) {
      // 创建游戏
      const gameMap = new Map()
      for (const record of jsonData.records.nx) {
        const platform = platformMap.get("Switch")
        try {
          const game = await prisma.game.upsert({
            where: { title: record.gameName },
            create: {
              title: record.gameName,
              titleAlias: record.gameName,
              imageIcon: record.gameCoverUrl,
              platform: {
                connect: [{ id: platform.id }]
              }
            },
            update: {
              platform: {
                connect: [{ id: platform.id }]
              }
            }
          })
          gameMap.set(record.gameName, game)
        } catch (error) {
          console.log(error)
          result.failedGame++
        }
      }

      // 创建记录
      for (const record of jsonData.records.nx) {
        const platform = platformMap.get("Switch")
        const game = gameMap.get(record.gameName)
        try {
          await prisma.record.upsert({
            where: {
              startAt_endAt: {
                startAt: record.startAt,
                endAt: record.endAt
              }
            },
            create: {
              platformId: platform.id,
              gameId: game.id,
              player: record.userName,
              startAt: record.startAt,
              endAt: record.endAt,
              playSeconds: record.playSeconds
            },
            update: {}
          })
        } catch (error) {
          console.log(error)
          result.failedRecord++
        }
      }
    }
  } catch (error) {
    throw new Error(error)
  }
}
