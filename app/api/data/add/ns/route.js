import { importNs } from "@/lib/ns/import"
import { sendResponse } from "@/lib/http/response"

export async function POST(request) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")
    const jsonData = await request.json()

    let result = { failedPlatform: 0, failedGame: 0, failedRecord: 0 }
    if (jsonData.exportVersion === "1.5.0") {
      await importNs(userId, jsonData, result)
    } else {
      throw { code: 400, message: "不支持的JSON文件" }
    }

    return sendResponse(request, {
      data: {
        failed: result.failedPlatform + result.failedGame + result.failedRecord,
        failedResult: result
      }
    })
  } catch (error) {
    return sendResponse(request, {
      code: error.code || 500,
      message: error.message
    })
  }
}
