import { prisma } from "@/lib/prisma"
import { sendResponse } from "@/lib/http/response"
import { tf } from "@/lib/utils"

export async function GET(request) {
  try {
    // 获取 URL 参数
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit")) || 25
    const page = parseInt(searchParams.get("page")) || 1
    const type = searchParams.get("type")?.toLowerCase() || "all"

    let psnRecords = []
    let nxRecords = []

    if (type === "all" || type === "psn") {
      psnRecords = await prisma.psnRecord.findMany({
        where: { state: "gaming" },
        orderBy: { endAt: "desc" }
      })
    }

    if (type === "all" || type === "nx") {
      nxRecords = await prisma.nxRecord.findMany({
        where: { state: "gaming" },
        orderBy: { endAt: "desc" }
      })
    }

    // 合并并格式化两种记录
    const combinedRecords = [
      ...psnRecords.map((record) => ({
        state: record.state,
        name: record.titleName,
        platform: record.launchPlatform,
        cover: record.conceptIconUrl,
        startAt: record.startAt,
        endAt: record.endAt,
        playSeconds: record.playSeconds,
        playTime: tf(record.playSeconds)
      })),
      ...nxRecords.map((record) => ({
        state: record.state,
        name: record.gameName,
        platform: record.gamePlatform,
        cover: record.gameCoverUrl,
        startAt: record.startAt,
        endAt: record.endAt,
        playSeconds: record.playSeconds,
        playTime: tf(record.playSeconds)
      }))
    ].sort((a, b) => new Date(b.endAt) - new Date(a.endAt))

    // 处理分页
    const skip = (page - 1) * limit
    const paginatedRecords = combinedRecords.slice(skip, skip + limit)

    return sendResponse(request, {
      data: {
        records: paginatedRecords,
        pagination: {
          total: combinedRecords.length,
          page,
          limit,
          totalPages: Math.ceil(combinedRecords.length / limit)
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
