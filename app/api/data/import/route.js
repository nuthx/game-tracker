import { importV1 } from "@/lib/backup/v1"
import { importV2 } from "@/lib/backup/v2"
import { sendResponse } from "@/lib/http/response"

export async function POST(request) {
  try {
    const jsonData = await request.json()

    let result = { failedPlatform: 0, failedGame: 0, failedRecord: 0 }
    if (jsonData.version === "v1") {
      await importV1(jsonData, result)
    } else if (jsonData.version === "v2") {
      await importV2(jsonData, result)
    } else {
      throw { code: 400, message: "JSON记录文件的版本错误" }
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
