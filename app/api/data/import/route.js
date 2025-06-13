import { importV1 } from "@/lib/import/v1"
import { importV2 } from "@/lib/import/v2"
import { sendResponse } from "@/lib/http/response"

export async function POST(request) {
  try {
    const jsonData = await request.json()

    // 暂时不支持success与skipped
    let result = { success: 0, skipped: 0, failed: 0 }

    if (jsonData.version === "v1") {
      result = await importV1(jsonData)
    } else if (jsonData.version === "v2") {
      result = await importV2(jsonData)
    } else {
      throw { code: 400, message: "JSON记录文件的版本错误" }
    }

    return sendResponse(request, {
      data: result
    })
  } catch (error) {
    return sendResponse(request, {
      code: error.code || 500,
      message: error.message
    })
  }
}
