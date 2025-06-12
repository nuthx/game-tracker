import { prisma } from "@/lib/prisma"
import { sendResponse } from "@/lib/http/response"

export async function DELETE(request) {
  try {
    const psnResult = await prisma.psnRecord.deleteMany({})
    const nxResult = await prisma.nxRecord.deleteMany({})

    return sendResponse(request, {
      data: {
        count: psnResult.count + nxResult.count
      }
    })
  } catch (error) {
    return sendResponse(request, {
      code: error.code || 500,
      message: error.message
    })
  }
}
