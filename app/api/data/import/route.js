import { importRecords } from "@/lib/import"
import { sendResponse } from "@/lib/http/response"

export async function POST(request) {
  try {
    const jsonData = await request.json()
    let importResult = { success: 0, skipped: 0, failed: 0 }

    // 根据JSON版本使用不同的导入规则
    if (jsonData.version === "v1") {
      // 导入 PSN 记录
      await importRecords("psnRecord", jsonData.records.psn, importResult, (record) => ({
        startAt: new Date(record.startAt),
        endAt: new Date(record.endAt)
      }))

      // 导入 NX 记录
      await importRecords("nxRecord", jsonData.records.nx, importResult, (record) => ({
        startAt: new Date(record.startAt),
        endAt: new Date(record.endAt)
      }))
    } else {
      throw { code: 400, message: "JSON记录文件的版本错误" }
    }

    return sendResponse(request, {
      data: importResult
    })
  } catch (error) {
    return sendResponse(request, {
      code: error.code || 500,
      message: error.message
    })
  }
}
