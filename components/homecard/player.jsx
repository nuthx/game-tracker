"use client"

import dayjs from "dayjs"
import { useTranslation } from "react-i18next"
import { Skeleton } from "@/components/ui/skeleton"
import { API } from "@/lib/http/api"
import { useData } from "@/lib/http/swr"
import { TimeDisplay } from "@/components/time"
import { Image } from "@/components/image"

export function PlayerCard() {
  const { t } = useTranslation()
  const { data: presenceData, error: presenceError, isLoading: presenceLoading } = useData(API.PRESENCE)

  // 加载中
  if (presenceLoading) {
    return (
      <div className="flex flex-row items-center gap-3 md:gap-6 p-3 md:p-6 border rounded-lg border shadow-xs bg-background">
        <Skeleton className="rounded-full size-18 shrink-0" />
        <div className="flex flex-col gap-2 w-full">
          <Skeleton className="h-6 w-1/3 rounded" />
          <Skeleton className="h-5 w-2/3 rounded" />
        </div>
      </div>
    )
  }

  // 错误
  if (presenceError) {
    return (
      <div className="flex flex-row items-center gap-3 md:gap-6 p-3 md:p-6 border rounded-lg border shadow-xs bg-background">
        <div className="rounded-full size-18 shrink-0 bg-muted"></div>
        <div className="flex flex-col gap-2 w-full">
          <p className="font-bold">{presenceError.code === 400 ? t("home.error.no_login") : t("home.error.load_error")}</p>
          <p className="text-sm text-muted-foreground">{presenceError.code === 400 ? t("home.error.login_first") : presenceError.message}</p>
        </div>
      </div>
    )
  }

  // 离线
  if (presenceData.status === 0) {
    return (
      <div className="flex flex-row items-center gap-3 md:gap-6 p-3 md:p-6 border rounded-lg border shadow-xs bg-background">
        <Image src={presenceData.playerAvatar} alt={presenceData.playerName} className="rounded-full size-18 grayscale opacity-80" />
        <div className="flex flex-col gap-2 w-full">
          <p className="font-bold">{t("home.offline")}</p>
          <p className="text-sm text-muted-foreground">
            {t("home.last_online")}: {dayjs(presenceData.lastOnline).format("YYYY-MM-DD HH:mm:ss")}
          </p>
        </div>
      </div>
    )
  }

  // 在线
  if (presenceData.status === 1) {
    return (
      <div className="flex flex-row items-center gap-3 md:gap-6 p-3 md:p-6 border rounded-lg border shadow-xs bg-background">
        <Image src={presenceData.playerAvatar} alt={presenceData.playerName} className="rounded-full size-18" />
        <div className="flex flex-col gap-2 w-full">
          <p className="font-bold">{t("home.online")}</p>
          <p className="text-sm text-muted-foreground">{t("home.waiting")}</p>
        </div>
      </div>
    )
  }

  // 游戏中
  return (
    <div className="flex flex-row items-center gap-3 md:gap-6 p-3 md:p-6 border rounded-lg border shadow-xs bg-background">
      <div className="relative shrink-0">
        <Image src={presenceData.playerAvatar} alt={presenceData.playerName} className="rounded-full size-18" />
        <Image src={presenceData.gameIcon} alt={presenceData.gameTitle} className="rounded-sm size-10 border-3 border-white absolute -bottom-[3px] -right-2" />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <p className="font-bold">{presenceData.gameTitle}</p>
        <p className="text-sm text-muted-foreground">
          {t("home.gaming_time")}
          {" "}
          <TimeDisplay seconds={presenceData.playSeconds} />
        </p>
      </div>
    </div>
  )
}
