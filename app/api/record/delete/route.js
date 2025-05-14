import { prisma } from "@/lib/prisma"
import { sendResponse } from "@/lib/http/response"

export async function DELETE(request) {
  try {
    const result = await prisma.psnRecord.deleteMany({})

    return sendResponse(request, {
      data: {
        count: result.count
      }
    })
  } catch (error) {
    return sendResponse(request, {
      code: error.code || 500,
      message: error.message
    })
  }
}
