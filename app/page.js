"use client"

import Image from "next/image"
import { useTranslation } from "react-i18next"
import { useData, API } from "@/lib/swr"
import {
  Card,
  CardContent
} from "@/components/ui/card"

export default function Page() {
  const { t } = useTranslation()
  const { data: presenceData, error: presenceError, isLoading: presenceLoading } = useData(API.PRESENCE)

  if (presenceLoading) {
    return <div className="flex justify-center text-sm text-muted-foreground">{t("toast.loading")}</div>
  }

  if (presenceError) {
    if (presenceError.code === 400) {
      return <div className="flex justify-center text-sm text-muted-foreground">{t("toast.no_npsso")}</div>
    } else {
      return <div className="flex justify-center text-sm text-muted-foreground">{t("toast.error_user")}</div>
    }
  }

  return (
    <div className="flex flex-row gap-4 md:gap-6">
      <Card className="w-full">
        <CardContent className="flex flex-row items-center gap-5">
          <Image
            src={presenceData.gameTitleInfoList?.[0]?.conceptIconUrl || presenceData.gameTitleInfoList?.[0]?.npTitleIconUrl || "/images/playstation.jpg"}
            alt={presenceData.gameTitleInfoList?.[0]?.titleName || "PlayStation"}
            className={`rounded-md object-cover w-24 h-24 ${presenceData.availability === "unavailable" ? "grayscale opacity-50" : ""}`}
            width={96}
            height={96}
            priority
            draggable="false"
          />
          {presenceData.availability === "unavailable"
            ? (
                <div className="flex flex-col gap-2">
                  <p className="font-bold">{t("home.user_offline")}</p>
                  <p className="text-sm text-muted-foreground">{t("home.last_online")}: {new Date(presenceData.primaryPlatformInfo.lastOnlineDate).toLocaleString()}</p>
                </div>
              )
            : presenceData.gameTitleInfoList && presenceData.gameTitleInfoList.length > 0
              ? (
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm text-muted-foreground">{t("home.playing_platform", { platform: presenceData.primaryPlatformInfo.platform.toUpperCase() })}</p>
                    <p className="font-bold">{presenceData.gameTitleInfoList[0].titleName}</p>
                    <p className="text-sm text-muted-foreground">{t("home.playing_time", { time: presenceData.gameTime })}</p>
                  </div>
                )
              : (
                  <div className="flex flex-col gap-2">
                    <p className="font-bold">{t("home.user_online", { platform: presenceData.primaryPlatformInfo.platform.toUpperCase() })}</p>
                    <p className="text-sm text-muted-foreground">{t("home.not_playing")}</p>
                  </div>
                )}
        </CardContent>
      </Card>
    </div>
  )
}
