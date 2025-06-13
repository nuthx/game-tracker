import { prisma } from "@/lib/prisma"

export async function importV2(jsonData, result) {
  try {
    const platformMap = new Map()
    const gameMap = new Map()

    // 创建平台
    if (jsonData.platforms?.length > 0) {
      for (const platform of jsonData.platforms) {
        try {
          // eslint-disable-next-line no-unused-vars
          const { id, ...platformData } = platform
          const newPlatform = await prisma.platform.upsert({
            where: {
              uname: platformData.uname
            },
            create: platformData,
            update: {}
          })
          platformMap.set(platformData.name, newPlatform)
        } catch (error) {
          console.log(error)
          result.failedPlatform++
        }
      }
    }

    // 创建游戏
    if (jsonData.games?.length > 0) {
      for (const game of jsonData.games) {
        try {
          // eslint-disable-next-line no-unused-vars
          const { id, platform, ...gameData } = game
          const newGame = await prisma.game.upsert({
            where: { title: gameData.title },
            create: {
              ...gameData,
              platform: {
                connect: platform.map((name) => ({ name: name }))
              }
            },
            update: {
              platform: {
                connect: platform.map((name) => ({ name: name }))
              }
            }
          })
          gameMap.set(gameData.title, newGame)
        } catch (error) {
          console.log(error)
          result.failedGame++
        }
      }
    }

    // 创建记录
    if (jsonData.records?.length > 0) {
      for (const record of jsonData.records) {
        try {
          // eslint-disable-next-line no-unused-vars
          const { id, game, platform, ...recordData } = record
          await prisma.record.upsert({
            where: {
              startAt_endAt: {
                startAt: record.startAt,
                endAt: record.endAt
              }
            },
            create: {
              ...recordData,
              gameId: gameMap.get(game).id,
              platformId: platformMap.get(platform).id
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
