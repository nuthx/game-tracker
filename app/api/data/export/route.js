import { prisma } from "@/lib/prisma"
import { sendResponse } from "@/lib/http/response"

export async function GET(request) {
  try {
    const platforms = await prisma.platform.findMany()
    const games = await prisma.game.findMany({
      include: {
        platform: true
      }
    })
    const records = await prisma.record.findMany({
      include: {
        platform: true,
        game: true
      }
    })

    const processedGames = games.map((game) => ({
      ...game,
      platform: game.platform.map((p) => p.name)
    }))

    const processedRecords = records.map((record) => ({
      ...record,
      platformId: undefined,
      platform: record.platform.name,
      gameId: undefined,
      game: record.game.title
    }))

    return sendResponse(request, {
      data: {
        version: "v2",
        date: new Date().toISOString(),
        count: {
          total: games.length + platforms.length + records.length,
          platform: platforms.length,
          game: games.length,
          record: records.length
        },
        platforms,
        games: processedGames,
        records: processedRecords
      }
    })
  } catch (error) {
    return sendResponse(request, {
      code: error.code || 500,
      message: error.message
    })
  }
}
