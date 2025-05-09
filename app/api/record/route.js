import { prisma } from "@/lib/prisma"
import { sendResponse } from "@/lib/http"

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
        playTime: true
      },
      orderBy: {
        id: "desc"
      }
    })

    return sendResponse(request, {
      data: records
    })
  } catch (error) {
    return sendResponse(request, {
      code: 500,
      message: error.message
    })
  }
}
