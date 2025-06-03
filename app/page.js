"use client"

import { useTranslation } from "react-i18next"
import { API } from "@/lib/http/api"
import { useData } from "@/lib/http/swr"
import { UserCard } from "@/components/user-card"
import { RecordCard } from "@/components/record-card"

export default function Page() {
  const { t } = useTranslation()

  const { data: recordData, error: recordError, isLoading: recordLoading } = useData(API.RECORD)

  if (recordLoading) {
    return <div className="flex justify-center text-sm text-muted-foreground">{t("toast.loading")}</div>
  }

  if (recordError) {
    return <div className="flex justify-center text-sm text-muted-foreground">{t("toast.error_user")}</div>
  }

  return (
    <div className="max-w-screen-lg mx-auto flex flex-col gap-4">
      <UserCard />
      <RecordCard records={recordData} />
    </div>
  )
}
