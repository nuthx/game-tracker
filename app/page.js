"use client"

import Image from "next/image"
import { useTranslation } from "react-i18next"
import { useData, API } from "@/lib/swr"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function Page() {
  const { t } = useTranslation()
  const { data: presenceData, error: presenceError, isLoading: presenceLoading } = useData(API.PRESENCE)
  const { data: recordData, error: recordError, isLoading: recordLoading } = useData(API.RECORD)

  if (presenceLoading || recordLoading) {
    return <div className="flex justify-center text-sm text-muted-foreground">{t("toast.loading")}</div>
  }

  if (presenceError || recordError) {
    if (presenceError.code === 400) {
      return <div className="flex justify-center text-sm text-muted-foreground">{t("toast.no_npsso")}</div>
    } else {
      return <div className="flex justify-center text-sm text-muted-foreground">{t("toast.error_user")}</div>
    }
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <Card className="w-full">
        <CardContent className="flex flex-row items-center gap-5">
          <Image
            src={presenceData.gameTitleInfoList?.[0]?.conceptIconUrl || presenceData.gameTitleInfoList?.[0]?.npTitleIconUrl || "/images/playstation.jpg"}
            alt={presenceData.gameTitleInfoList?.[0]?.titleName || "PlayStation"}
            className={`rounded-sm object-cover size-20 ${presenceData.availability === "unavailable" ? "grayscale opacity-50" : ""}`}
            width={80}
            height={80}
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
                    <p className="text-sm text-muted-foreground">{t("home.playing_time")} {presenceData.playTime.minutes > 0 ? `${presenceData.playTime.minutes} ${t("time.minutes")} ` : ""}{presenceData.playTime.seconds} {t("time.seconds")}</p>
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

      <Card>
        <CardContent className="flex flex-col gap-4">
          {recordData?.map((record, index) => (
            <div key={index}>
              { index > 0 && <Separator className="mb-4" /> }
              { record.state === "gaming" ? <GamingRecord record={record} /> : <OnlineRecord record={record} /> }
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function GamingRecord({ record }) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-row gap-4 items-center">
      <Image src={record.conceptIconUrl} alt={record.titleName} className="rounded-sm object-cover size-14" width={64} height={64} priority draggable="false" />
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-bold">[{record.launchPlatform}] {record.titleName}</p>
        <p className="text-sm text-muted-foreground">
          {t("home.last_gaming")}: {new Date(record.endAt).toLocaleString()} [
          {record.playTime.minutes > 0 ? `${record.playTime.minutes} ${t("time.minutes")} ` : ""}
          {record.playTime.seconds} {t("time.seconds")}]
        </p>
      </div>
    </div>
  )
}

function OnlineRecord({ record }) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="size-14 bg-muted rounded-sm"></div>
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-bold">{t("home.online")}</p>
        <p className="text-sm text-muted-foreground">
          {t("home.last_online")}: {new Date(record.endAt).toLocaleString()} [
          {record.playTime.minutes > 0 ? `${record.playTime.minutes} ${t("time.minutes")} ` : ""}
          {record.playTime.seconds} {t("time.seconds")}]
        </p>
      </div>
    </div>
  )
}
