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
    return <div className="flex justify-center text-sm text-muted-foreground">{t("toast.error_user")}</div>
  }

  if (!presenceData) {
    return <div className="flex justify-center text-sm text-muted-foreground">{t("toast.no_npsso")}</div>
  }

  return (
    <div className="flex flex-row gap-4 md:gap-6">
      {presenceData.availability === "unavailable"
        ? (
            <Card className="w-full">
              <CardContent>
                <p className="text-sm">{t("home.user_offline")}</p>
              </CardContent>
            </Card>
          )
        : (
            <Card className="w-full">
              <CardContent className="flex flex-row items-center gap-5">
                <Image src={presenceData.gameTitleInfoList[0]?.conceptIconUrl || presenceData.gameTitleInfoList[0]?.npTitleIconUrl} alt={presenceData.gameTitleInfoList[0]?.titleName} className="rounded-md object-cover w-24 h-24" width={96} height={96} priority draggable="false" />
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm text-muted-foreground">{t("home.playing_platform", { platform: presenceData.gameTitleInfoList[0].launchPlatform.toUpperCase() })}</p>
                  <p className="font-bold">{presenceData.gameTitleInfoList[0].titleName}</p>
                  <p className="text-sm text-muted-foreground">{t("home.playing_time", { time: presenceData.gameTime })}</p>
                </div>
              </CardContent>
            </Card>
          )}
    </div>
  )
}
