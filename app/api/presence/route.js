import { getBasicPresence } from "psn-api";
import { prisma } from "@/lib/prisma";
import { getAuthorization } from "@/lib/auth";
import { sendResponse } from "@/lib/http";

export async function GET(request) {
  try {
    const user = await prisma.user.findUnique({ where: { id: 1 } });

    if (!user.npsso) {
      return sendResponse(request, {
        code: 400,
        message: "请先登录PSN账号",
      });
    }

    const authorization = await getAuthorization();
    const presence = await getBasicPresence(authorization, user.monitorId);

    // 计算游戏时长
    let gameTime = 0;
    if (presence.basicPresence.gameTitleInfoList?.length) {
      const lastGame = await prisma.psnRecord.findFirst({
        where: {
          endAt: null,
          user: { some: { id: user.id } }
        }
      });
      gameTime = Math.floor((new Date() - new Date(lastGame.startAt)) / 1000 / 60);
    }

    return sendResponse(request, { 
      data: {
        ...presence.basicPresence,
        gameTime
      }
    });
  } catch (error) {
    return sendResponse(request, {
      code: 500,
      message: error.message,
    });
  }
}
