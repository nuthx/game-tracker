"use client"

import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { API } from "@/lib/http/api"
import { useData } from "@/lib/http/swr"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { UserCard } from "@/components/user"
import { Pagination } from "@/components/pagination"

export default function Page() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get("page")) || 1
  const currentType = searchParams.get("type") || "all"

  const updateUrlParams = (newPage, newType) => {
    const params = new URLSearchParams()
    if (newPage > 1) {
      params.set("page", newPage.toString())
    }
    if (newType !== "all") {
      params.set("type", newType)
    }
    const queryString = params.toString()
    router.push(queryString ? `?${queryString}` : "/")
  }

  const { data: recordData, error: recordError, isLoading: recordLoading } = useData(`${API.RECORD}?page=${currentPage}&type=${currentType}`)

  if (recordLoading) {
    return <div className="flex justify-center text-sm text-muted-foreground">{t("toast.loading")}</div>
  }

  if (recordError) {
    return <div className="flex justify-center text-sm text-muted-foreground">{t("toast.error_user")}</div>
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <UserCard />

      <div className="flex items-center">
        <Select value={currentType} onValueChange={(newType) => updateUrlParams(1, newType)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filter.all_platforms")}</SelectItem>
            <SelectItem value="psn">PlayStation</SelectItem>
            <SelectItem value="nx">Nintendo Switch</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4">
          {recordData?.records?.map((record, index) => (
            <div key={index}>
              { index > 0 && <Separator className="mb-4" /> }
              { record.state === "gaming" ? <GamingRecord record={record} /> : <OnlineRecord record={record} /> }
            </div>
          ))}
        </CardContent>
      </Card>

      <Pagination page={currentPage} totalPages={recordData.pagination.totalPages} onChange={(newPage) => updateUrlParams(newPage, currentType)} />
    </div>
  )
}

function GamingRecord({ record }) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-row gap-4 items-center">
      <Image src={record.cover} alt={record.name} className="rounded-sm object-cover size-14" width={64} height={64} priority draggable="false" />
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-bold">[{record.platform}] {record.name}</p>
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
