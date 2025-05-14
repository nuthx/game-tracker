import { prisma } from "@/lib/prisma"
import { sendResponse } from "@/lib/http/response"
import { tf } from "@/lib/utils"

export async function GET(request) {
  try {
    const records = await prisma.psnRecord.findMany({
      select: {
        state: true,
        titleName: true,
        launchPlatform: true,
        conceptIconUrl: true,
        startAt: true,
        endAt: true,
        playSeconds: true
      },
      orderBy: {
        endAt: "desc"
      }
    })

    return sendResponse(request, {
      data: records.map((record) => ({
        ...record,
        playTime: tf(record.playSeconds)
      }))
    })
  } catch (error) {
    return sendResponse(request, {
      code: error.code || 500,
      message: error.message
    })
  }
}
