import { prisma } from "@/lib/prisma"
import { sendResponse } from "@/lib/http/response"

export async function GET(request) {
  try {
    const games = await prisma.game.findMany()
    const platforms = await prisma.platform.findMany()
    const records = await prisma.record.findMany()

    return sendResponse(request, {
      data: {
        version: "v2",
        date: new Date().toISOString(),
        count: {
          total: games.length + platforms.length + records.length,
          game: games.length,
          platform: platforms.length,
          record: records.length
        },
        games,
        platforms,
        records
      }
    })
  } catch (error) {
    return sendResponse(request, {
      code: error.code || 500,
      message: error.message
    })
  }
}
