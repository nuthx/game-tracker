import { prisma } from "@/lib/prisma"
import { sendResponse } from "@/lib/http/response"

export async function GET(request) {
  try {
    // 获取 URL 参数
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page")) || 1
    const limit = parseInt(searchParams.get("limit")) || 25
    const platform = searchParams.get("platform") || "all"
    const game = searchParams.get("game") || "all"
    const player = searchParams.get("player") || "all"

    const records = await prisma.record.findMany({
      where: {
        ...(platform !== "all" && {
          platform: {
            name: platform
          }
        }),
        ...(game !== "all" && {
          game: {
            title: { contains: game }
          }
        }),
        ...(player !== "all" && { player })
      },
      include: {
        platform: true,
        game: true
      },
      orderBy: { endAt: "desc" }
    })

    // 处理分页
    const skip = (page - 1) * limit
    const paginatedRecords = records.slice(skip, skip + limit)

    return sendResponse(request, {
      data: {
        records: paginatedRecords,
        pagination: {
          total: records.length,
          page,
          limit,
          totalPages: Math.ceil(records.length / limit)
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
