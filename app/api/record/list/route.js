import { prisma } from "@/lib/prisma"
import { sendResponse } from "@/lib/http/response"

export async function GET(request) {
  try {
    const records = await prisma.record.findMany({
      include: {
        platform: true,
        game: true
      },
      orderBy: { endAt: "desc" }
    })

    return sendResponse(request, {
      data: {
        platforms: [...new Set(records.map((r) => r.platform.name))].sort(),
        games: [...new Set(records.map((r) => r.game.title))].sort(),
        players: [...new Set(records.map((r) => r.player))].sort()
      }
    })
  } catch (error) {
    return sendResponse(request, {
      code: error.code || 500,
      message: error.message
    })
  }
}
