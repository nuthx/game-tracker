import { getBasicPresence } from "psn-api";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { getAuthorization } from "@/lib/auth";

// 程序启动时，结束错误的游戏记录
export async function closeErrorRecord() {
  const records = await prisma.psnRecord.findMany({ where: { endAt: null } });
  for (const record of records) {
    await prisma.psnRecord.update({
      where: { id: record.id },
      data: {
        endAt: new Date(),
        playTime: Math.floor((new Date() - new Date(record.startAt)) / 1000 / 60),
        error: 1
      }
    });
  }
  if (records.length > 0) {
    logger(`关闭了${records.length}条错误记录`);
  }
}

// 核心功能
// 检查并记录用户的游玩记录
export async function monitorUser() {
  try {
    const user = await prisma.user.findUnique({ where: { id: 1 } });
    if (!user.npsso) {
      logger("NPSSO未设置", "error");
      return;
    }

    // 获取用户在线状态
    const authorization = await getAuthorization();
    const presence = await getBasicPresence(authorization, user.monitorId);
    if (!presence.basicPresence.gameTitleInfoList?.length) {
      const lastGame = await prisma.psnRecord.findFirst({
        where: {
          endAt: null,
          user: { some: { id: user.id } }
        }
      });

      // 用户离线时，更新最后活跃游戏的结束时间
      if (lastGame) {
        await prisma.psnRecord.update({
          where: { id: lastGame.id },
          data: {
            endAt: new Date(),
            playTime: Math.floor((new Date() - new Date(lastGame.startAt)) / 1000 / 60)
          }
        });
      }

      logger(`用户 ${user.monitorId} 未运行游戏`);
      return;
    }

    // 获取当前活跃的游戏会话
    const activeGame = await prisma.psnRecord.findFirst({
      where: {
        endAt: null,
        user: { some: { id: user.id } }
      }
    });

    // 仍在玩同一个游戏，不做任何操作
    const game = presence.basicPresence.gameTitleInfoList[0];
    if (activeGame?.npTitleId === game.npTitleId) {
      return;
    }

    // 更换游戏时，记录上个游戏的结束时间
    if (activeGame) {
      await prisma.psnRecord.update({
        where: { id: activeGame.id },
        data: {
          endAt: new Date(),
          playTime: Math.floor((new Date() - new Date(activeGame.startAt)) / 1000 / 60)
        }
      });
    }

    // 创建新的游戏记录
    await prisma.psnRecord.create({
      data: {
        npTitleId: game.npTitleId.toUpperCase(),
        titleName: game.titleName,
        format: game.format.toUpperCase(),
        launchPlatform: game.launchPlatform.toUpperCase(),
        conceptIconUrl: game?.conceptIconUrl || game?.npTitleIconUrl || "",
        startAt: new Date(),
        user: {
          connect: { id: user.id }
        }
      }
    });

    logger(`用户 ${user.monitorId} 正在游玩: [${game.launchPlatform} - ${game.npTitleId}] ${game.titleName}`);
  } catch (error) {
    logger(error, "error");
  }
}
