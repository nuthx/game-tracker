import { prisma } from "@/lib/prisma"
import { sendResponse } from "@/lib/http/response"

export async function GET(request) {
  try {
    // 获取 URL 参数
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page")) || 1
    const limit = parseInt(searchParams.get("limit")) || 20

    const games = await prisma.game.findMany({
      include: {
        platform: true
      }
    })

    // 处理分页
    const skip = (page - 1) * limit
    const paginatedGames = games.slice(skip, skip + limit)

    return sendResponse(request, {
      data: {
        games: paginatedGames,
        pagination: {
          total: games.length,
          page,
          limit,
          totalPages: Math.ceil(games.length / limit)
        }
      }
    })
  } catch (error) {
    return sendResponse(request, {
      code: error.code || 500,
      message: error.message
    })
  }
}
