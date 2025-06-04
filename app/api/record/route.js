import { prisma } from "@/lib/prisma"
import { sendResponse } from "@/lib/http/response"
import { tf } from "@/lib/utils"

export async function GET(request) {
  try {
    // 获取 URL 参数
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit")) || 25
    const page = parseInt(searchParams.get("page")) || 1
    const platform = searchParams.get("platform") || "all"
    const user = searchParams.get("user") || "all"
    const title = searchParams.get("title") || "all"

    let psnRecords = []
    let nxRecords = []

    if (platform === "all" || platform === "psn") {
      psnRecords = await prisma.psnRecord.findMany({
        where: {
          state: "gaming",
          ...(user !== "all" && { userName: user === "unknown" ? "" : user }),
          ...(title !== "all" && { titleName: { contains: title } })
        },
        orderBy: { endAt: "desc" }
      })
    }

    if (platform === "all" || platform === "nx") {
      nxRecords = await prisma.nxRecord.findMany({
        where: {
          state: "gaming",
          ...(user !== "all" && { userName: user === "unknown" ? "" : user }),
          ...(title !== "all" && { gameName: { contains: title } })
        },
        orderBy: { endAt: "desc" }
      })
    }

    // 合并并格式化两种记录
    const combinedRecords = [
      ...psnRecords.map((record) => ({
        state: record.state,
        name: record.titleName,
        titleId: record.npTitleId,
        platform: record.launchPlatform,
        cover: record.conceptIconUrl,
        user: record.userName || "unknown",
        startAt: record.startAt,
        endAt: record.endAt,
        playSeconds: record.playSeconds,
        playTime: tf(record.playSeconds)
      })),
      ...nxRecords.map((record) => ({
        state: record.state,
        name: record.gameName,
        titleId: record.gameId,
        platform: record.gamePlatform,
        cover: record.gameCoverUrl,
        user: record.userName || "unknown",
        startAt: record.startAt,
        endAt: record.endAt,
        playSeconds: record.playSeconds,
        playTime: tf(record.playSeconds)
      }))
    ].sort((a, b) => new Date(b.endAt) - new Date(a.endAt))

    // 获取所有用户和标题
    const allPsnRecords = await prisma.psnRecord.findMany({ where: { state: "gaming" } })
    const allNxRecords = await prisma.nxRecord.findMany({ where: { state: "gaming" } })

    // 获取所有唯一用户和标题
    const uniqueUsers = [...new Set([...allPsnRecords.map((r) => r.userName || "unknown"), ...allNxRecords.map((r) => r.userName || "unknown")])].sort()
    const uniqueTitles = [...new Set([...allPsnRecords.map((r) => r.titleName), ...allNxRecords.map((r) => r.gameName)])].sort()

    // 处理分页
    const skip = (page - 1) * limit
    const paginatedRecords = combinedRecords.slice(skip, skip + limit)

    return sendResponse(request, {
      data: {
        records: paginatedRecords,
        users: uniqueUsers,
        titles: uniqueTitles,
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
