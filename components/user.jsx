"use client"

import Image from "next/image"
import { useTranslation } from "react-i18next"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { API } from "@/lib/http/api"
import { useData } from "@/lib/http/swr"

export function UserCard() {
  const { t } = useTranslation()
  const { data: presenceData, error: presenceError, isLoading: presenceLoading } = useData(API.PRESENCE)

  // 加载中
  if (presenceLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-row items-center gap-6">
          <Skeleton className="rounded-full size-18 shrink-0" />
          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="h-6 w-1/3 rounded" />
            <Skeleton className="h-5 w-2/3 rounded" />
          </div>
        </CardContent>
      </Card>
    )
  }

  // 错误
  if (presenceError) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-row items-center gap-6">
          <div className="rounded-full size-18 shrink-0 bg-muted"></div>
          <div className="flex flex-col gap-2 w-full">
            <p className="font-bold">{presenceError.code === 400 ? t("home.error.no_login") : t("home.error.load_error")}</p>
            <p className="text-sm text-muted-foreground">{presenceError.code === 400 ? t("home.error.login_first") : presenceError.message}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 离线
  if (presenceData.availability === "unavailable") {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-row items-center gap-6">
          <Image
            src={presenceData.monitorUser.avatar}
            alt={presenceData.monitorUser.name}
            className="rounded-full size-18 object-cover shrink-0 grayscale opacity-80"
            width={72}
            height={72}
            priority
            draggable="false"
          />
          <div className="flex flex-col gap-2 w-full">
            <p className="font-bold">{t("home.offline")}</p>
            <p className="text-sm text-muted-foreground">{presenceData.monitorUser.name} {t("home.last_online")}: {new Date(presenceData.primaryPlatformInfo.lastOnlineDate).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 在线
  if (!presenceData.gameTitleInfoList) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-row items-center gap-6">
          <Image
            src={presenceData.monitorUser.avatar}
            alt={presenceData.monitorUser.name}
            className="rounded-full size-18 object-cover shrink-0"
            width={72}
            height={72}
            priority
            draggable="false"
          />
          <div className="flex flex-col gap-2 w-full">
            <p className="font-bold">{t("home.online")}</p>
            <p className="text-sm text-muted-foreground">{presenceData.monitorUser.name} {t("home.online_time")} {presenceData.playTime.minutes > 0 ? `${presenceData.playTime.minutes} ${t("time.minutes")} ` : ""}{presenceData.playTime.seconds} {t("time.seconds")}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 游戏中
  return (
    <Card className="w-full">
      <CardContent className="flex flex-row items-center gap-6">
        <div className="relative shrink-0">
          <Image
            src={presenceData.monitorUser.avatar}
            alt={presenceData.monitorUser.name}
            className="rounded-full size-18 object-cover"
            width={72}
            height={72}
            priority
            draggable="false"
          />
          <Image
            src={presenceData.gameTitleInfoList[0]?.conceptIconUrl || presenceData.gameTitleInfoList[0]?.npTitleIconUrl}
            alt={presenceData.gameTitleInfoList[0].titleName}
            className="rounded-sm size-10 object-cover border-3 border-white absolute -bottom-[3px] -right-2"
            width={40}
            height={40}
            priority
            draggable="false"
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <p className="font-bold">{presenceData.gameTitleInfoList[0].titleName}</p>
          <p className="text-sm text-muted-foreground">{presenceData.monitorUser.name} {t("home.gaming_time")} {presenceData.playTime.minutes > 0 ? `${presenceData.playTime.minutes} ${t("time.minutes")} ` : ""}{presenceData.playTime.seconds} {t("time.seconds")}</p>
        </div>
      </CardContent>
    </Card>
  )
}
