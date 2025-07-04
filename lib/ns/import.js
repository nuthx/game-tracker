import { prisma, defaultPlatforms } from "@/lib/prisma"

/* 导入规则
 * 1. 每次Gain Focus和Lost Focus时间小于10秒时，忽略本条记录
 * 2. 相同游戏游玩时间间隔小于30秒，算作一条记录
 */

export async function importNs(userId, jsonData, result) {
  try {
    // 创建Switch平台
    let platform
    try {
      platform = await prisma.platform.upsert({
        where: { uname: defaultPlatforms[2].uname },
        create: defaultPlatforms[2],
        update: {}
      })
    } catch {
      result.failedPlatform++
    }

    // 仅提取指定用户的游戏记录
    const userRecords = jsonData.users.find((user) => user.id === userId)

    // 创建游戏
    const gameMap = new Map()
    for (const record of userRecords.titles) {
      try {
        const game = await prisma.game.upsert({
          where: { utitle: record.name },
          create: {
            utitle: record.name,
            title: record.name,
            titleAlias: record.name,
            imageIcon: `https://tinfoil.media/ti/${record.id}/800/800`,
            userStartAt: new Date(record.summary.firstPlayed * 1000),
            userEndAt: new Date(record.summary.lastPlayed * 1000),
            userPlaySeconds: record.summary.playtime,
            platform: {
              connect: [{ id: platform.id }]
            }
          },
          update: {
            platform: {
              connect: [{ id: platform.id }]
            }
          }
        })
        gameMap.set(record.name, game)
      } catch (error) {
        console.log(error)
        result.failedGame++
      }
    }

    // 每次循环会创建一个游戏的所有记录
    for (const record of userRecords.titles) {
      let records = []

      // 将所有记录写入records数组
      for (let index = 0; index < record.events.length; index++) {
        const event = record.events[index]

        // 跳过非 Gained Focus 事件
        if (event.type !== "Gained Focus") continue

        // 查找下一个 Lost Focus 事件
        const nextIndex = record.events.findIndex((e, i) => i > index && e.type === "Lost Focus")
        if (nextIndex === -1) continue
        const lostFocusEvent = record.events[nextIndex]

        const startAt = new Date(event.clockTimestamp * 1000)
        const endAt = new Date(lostFocusEvent.clockTimestamp * 1000)
        const playSeconds = Math.floor((endAt - startAt) / 1000)

        // 忽略小于10秒的记录
        if (playSeconds < 10) continue

        // 合并小于30秒的记录
        const lastRecord = records[records.length - 1]
        if (lastRecord) {
          const timeDiff = Math.floor((startAt - lastRecord.endAt) / 1000)
          if (timeDiff < 30) {
            lastRecord.endAt = endAt
            lastRecord.playSeconds += playSeconds + timeDiff
            continue
          }
        }

        // 添加到数组
        records.push({
          startAt: startAt,
          endAt: endAt,
          playSeconds: playSeconds
        })
      }

      // 创建所有记录
      for (const finalRecord of records) {
        try {
          await prisma.record.create({
            data: {
              platform: {
                connect: { uname: "Switch" }
              },
              game: {
                connect: { title: gameMap.get(record.name).title }
              },
              player: userRecords.name,
              startAt: finalRecord.startAt,
              endAt: finalRecord.endAt,
              playSeconds: finalRecord.playSeconds
            }
          })
        } catch (error) {
          console.log(error)
          result.failedRecord++
        }
      }
    }
  } catch (error) {
    throw new Error(error)
  }
}
