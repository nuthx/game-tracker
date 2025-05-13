import { prisma } from "@/lib/prisma"
import { sendResponse } from "@/lib/http"

export async function DELETE(request) {
  try {
    await prisma.psnRecord.deleteMany({})

    return sendResponse(request, {})
  } catch (error) {
    return sendResponse(request, {
      code: error.code || 500,
      message: error.message
    })
  }
}
