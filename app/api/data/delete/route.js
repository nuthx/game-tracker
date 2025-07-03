import { prisma } from "@/lib/prisma"
import { sendResponse } from "@/lib/http/response"

export async function DELETE(request) {
  try {
    const records = await prisma.record.deleteMany({})
    const games = await prisma.game.deleteMany({})
    const platforms = await prisma.platform.deleteMany({})

    return sendResponse(request, {
      data: {
        count: games.count + platforms.count + records.count
      }
    })
  } catch (error) {
    return sendResponse(request, {
      code: error.code || 500,
      message: error.message
    })
  }
}
