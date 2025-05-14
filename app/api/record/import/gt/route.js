import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import { sendResponse } from "@/lib/http/response"

export async function POST(request) {
  try {
    const jsonData = await request.json()
    let importResult = { success: 0, skipped: 0, failed: 0 }

    // 根据JSON版本使用不同的导入规则
    if (jsonData.version === "v1") {
      importResult = await importRecordV1(jsonData)
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

async function importRecordV1(jsonData) {
  try {
    const records = jsonData.records.psn
    const result = { success: 0, skipped: 0, failed: 0 }

    for (const record of records) {
      try {
        const existingRecord = await prisma.psnRecord.findFirst({
          where: {
            OR: [
              // 条件1: startAt和endAt都相同
              {
                startAt: new Date(record.startAt),
                endAt: new Date(record.endAt)
              },
              // 条件2: startAt和npTitleId都相同
              {
                startAt: new Date(record.startAt),
                npTitleId: record.npTitleId
              },
              // 条件3: endAt和npTitleId都相同
              {
                endAt: new Date(record.endAt),
                npTitleId: record.npTitleId
              }
            ]
          }
        })

        // 如果存在重复记录，则跳过
        if (existingRecord) {
          result.skipped++
          continue
        }

        // 创建新记录
        await prisma.psnRecord.create({
          data: {
            state: record.state,
            npTitleId: record.npTitleId,
            titleName: record.titleName,
            format: record.format,
            launchPlatform: record.launchPlatform,
            conceptIconUrl: record.conceptIconUrl,
            startAt: new Date(record.startAt),
            endAt: new Date(record.endAt),
            playSeconds: record.playSeconds
          }
        })
        result.success++
      } catch (recordError) {
        result.failed++
        logger(`导入记录失败: ${recordError}`, "error")
      }
    }

    return result
  } catch (error) {
    throw new Error(error)
  }
}
