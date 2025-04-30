"use client";

import Image from "next/image";
import { useData, API } from "@/lib/swr";
import {
  Card,
  CardContent,
} from "@/components/ui/card"

export default function Page() {
  const { data: presenceData, error: presenceError, isLoading: presenceLoading } = useData(API.PRESENCE);

  if (presenceLoading) {
    return <div className="flex justify-center text-sm text-muted-foreground">加载中...</div>;
  }

  if (presenceError) {
    return <div className="flex justify-center text-sm text-muted-foreground">用户信息获取失败</div>;
  }

  return (
    <div className="flex flex-row gap-4 md:gap-6">
      {presenceData.gameTitleInfoList?.length && (
        <Card className="w-full">
          <CardContent className="flex flex-row items-center gap-5">
            <Image src={presenceData.gameTitleInfoList[0]?.conceptIconUrl || presenceData.gameTitleInfoList[0]?.npTitleIconUrl} alt={presenceData.gameTitleInfoList[0]?.titleName} className="rounded-md object-cover w-24 h-24" width={96} height={96} priority draggable="false"/>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-muted-foreground">正在游玩 {presenceData.gameTitleInfoList[0].launchPlatform.toUpperCase()} 游戏</p>
              <p className="font-bold">{presenceData.gameTitleInfoList[0].titleName}</p>
              <p className="text-sm text-muted-foreground">已游玩 {presenceData.gameTime} 分钟</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
