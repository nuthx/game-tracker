import { prisma } from "@/lib/prisma"
import { sendResponse } from "@/lib/http/response"

export async function GET(request) {
  try {
    const psnRecords = await prisma.psnRecord.findMany({ orderBy: { endAt: "desc" } })
    const nxRecords = await prisma.nxRecord.findMany({ orderBy: { endAt: "desc" } })

    return sendResponse(request, {
      data: {
        version: "v1",
        date: new Date().toLocaleString(),
        count: {
          total: psnRecords.length + nxRecords.length,
          psn: psnRecords.length,
          nx: nxRecords.length
        },
        records: {
          psn: psnRecords,
          nx: nxRecords
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
