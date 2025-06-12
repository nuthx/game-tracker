import { prisma } from "@/lib/prisma"

export async function importV2(jsonData) {
  const result = { success: 0, skipped: 0, failed: 0 }

  try {
    if (jsonData.platforms?.length > 0) {
      for (const platform of jsonData.platforms) {
        try {
          // eslint-disable-next-line no-unused-vars
          const { id, ...platformData } = platform
          await prisma.platform.upsert({
            where: {
              slug: platformData.slug
            },
            create: platformData,
            update: {} // 如果已存在则不更新任何字段
          })
          result.success++
        } catch {
          result.failed++
        }
      }
    }

    if (jsonData.games?.length > 0) {
      // 获取所有平台的数据
      const platformsMap = new Map()
      const existingPlatforms = await prisma.platform.findMany()
      existingPlatforms.forEach((platform) => {
        platformsMap.set(platform.slug, platform)
      })

      for (const game of jsonData.games) {
        try {
          // eslint-disable-next-line no-unused-vars
          const { id, platform, ...gameData } = game

          // 将slug转换为平台id，不存在的平台会被跳过，但是依旧添加这个游戏
          const platformIdList = []
          for (const platformSlug of platform) {
            const platformRecord = platformsMap.get(platformSlug)
            if (platformRecord) {
              platformIdList.push({ id: platformRecord.id })
            }
          }

          await prisma.game.upsert({
            where: {
              title: gameData.title
            },
            create: {
              ...gameData,
              platform: {
                connect: platformIdList
              }
            },
            update: {
              platform: {
                connect: platformIdList // 已存在则新增关联
              }
            }
          })
          result.success++
        } catch {
          result.failed++
        }
      }
    }

    if (jsonData.records?.length > 0) {
      // 获取所有平台的数据
      const platformsMap = new Map()
      const existingPlatforms = await prisma.platform.findMany()
      existingPlatforms.forEach((platform) => {
        platformsMap.set(platform.slug, platform)
      })

      // 获取所有游戏的数据
      const gamesMap = new Map()
      const existingGames = await prisma.game.findMany()
      existingGames.forEach((game) => {
        gamesMap.set(game.title, game)
      })

      for (const record of jsonData.records) {
        try {
          const { id, game, platform, ...recordData } = record

          const platformRecord = platformsMap.get(platform)
          if (!platformRecord) {
            console.error(`导入记录 ${id} 失败: 平台 ${platform} 不存在`)
            result.failed++
            continue
          }

          const gameRecord = gamesMap.get(game)
          if (!gameRecord) {
            console.error(`导入记录 ${id} 失败: 游戏 ${game} 不存在`)
            result.failed++
            continue
          }

          // 查找是否存在相同的记录
          const existingRecord = await prisma.record.findFirst({
            where: {
              AND: [
                { gameId: gameRecord.id },
                { startAt: recordData.startAt },
                { endAt: recordData.endAt }
              ]
            }
          })

          // 添加时关联刚查询到的game和platform
          if (existingRecord) {
            result.skipped++
          } else {
            await prisma.record.create({
              data: {
                ...recordData,
                gameId: gameRecord.id,
                platformId: platformRecord.id
              }
            })
            result.success++
          }
        } catch {
          result.failed++
        }
      }
    }

    return result
  } catch (error) {
    throw new Error(error)
  }
}
