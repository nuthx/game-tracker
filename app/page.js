"use client"

import Link from "next/link"
import { useTranslation } from "react-i18next"
import { API } from "@/lib/http/api"
import { useData } from "@/lib/http/swr"
import { Button } from "@/components/ui/button"
import { PlayerCard } from "@/components/player-card"
import { Heatmap } from "@/components/heatmap"
import { RecordCard } from "@/components/record-card"

export default function Page() {
  const { t } = useTranslation()

  const { data: recordData, error: recordError, isLoading: recordLoading } = useData(`${API.RECORD}?limit=10`)

  if (recordLoading) {
    return <div className="flex justify-center text-sm text-muted-foreground">{t("toast.loading")}</div>
  }

  if (recordError) {
    return <div className="flex justify-center text-sm text-muted-foreground">{t("toast.error_user")}</div>
  }

  return (
    <div className="max-w-screen-lg mx-auto flex flex-col gap-4">
      <PlayerCard />
      <Heatmap />
      {recordData.records.length > 0 && (
        <>
          <RecordCard records={recordData.records} />
          <Link href="/record" className="w-full">
            <Button variant="ghost" className="w-full">
              {t("home.view_all")}
            </Button>
          </Link>
        </>
      )}
    </div>
  )
}
