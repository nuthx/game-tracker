import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"

export async function importRecords(modelName, records, importResult, whereCondition) {
  for (const record of records) {
    try {
      // 使用传入的函数生成查询条件
      const where = whereCondition(record)

      // 检查记录是否已存在
      const existingRecord = await prisma[modelName].findFirst({ where })

      // 跳过重复记录
      if (existingRecord) {
        importResult.skipped++
        continue
      }

      // 创建新记录
      await prisma[modelName].create({ data: record })
      importResult.success++
    } catch (recordError) {
      importResult.failed++
      logger(`导入记录失败: ${recordError}`, "error")
    }
  }
}
