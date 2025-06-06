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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"
import { Pagination } from "@/components/pagination"

export default function Page() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get("page")) || 1
  const currentPlatform = searchParams.get("platform") || "all"
  const currentTitle = searchParams.get("title") || "all"
  const currentUser = searchParams.get("user") || "all"

  const updateUrlParams = (newPage, newPlatform, newTitle, newUser) => {
    const params = new URLSearchParams()
    if (newPage > 1) {
      params.set("page", newPage.toString())
    }
    if (newPlatform !== "all") {
      params.set("platform", newPlatform)
    }
    if (newTitle !== "all") {
      params.set("title", newTitle)
    }
    if (newUser !== "all") {
      params.set("user", newUser)
    }
    const queryString = params.toString()
    router.push(queryString ? `?${queryString}` : "/record")
  }

  const { data: recordData, error: recordError, isLoading: recordLoading } = useData(
    `${API.RECORD}?limit=50&page=${currentPage}&platform=${currentPlatform}&user=${currentUser}&title=${currentTitle}`
  )

  if (recordLoading) {
    return <div className="flex justify-center text-sm text-muted-foreground">{t("toast.loading")}</div>
  }

  if (recordError) {
    return <div className="flex justify-center text-sm text-muted-foreground">{t("toast.error_user")}</div>
  }

  return (
    <div className="max-w-screen-2xl mx-auto flex flex-col gap-2 md:gap-4">
      <div className="flex gap-2 md:gap-3 items-center justify-end">
        <Select value={currentPlatform} onValueChange={(newPlatform) => updateUrlParams(1, newPlatform, currentTitle, currentUser)}>
          <SelectTrigger className="w-full bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filter.all_platforms")}</SelectItem>
            <SelectItem value="psn">PlayStation</SelectItem>
            <SelectItem value="nx">Nintendo Switch</SelectItem>
          </SelectContent>
        </Select>

        <Select value={currentUser} onValueChange={(newUser) => updateUrlParams(1, currentPlatform, currentTitle, newUser)}>
          <SelectTrigger className="w-full bg-background">
            <SelectValue placeholder={t("filter.search_user")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filter.all_users")}</SelectItem>
            {recordData?.users.map((user) => (
              <SelectItem key={user} value={user}>
                {user === "unknown" ? t("filter.unknown_user") : user}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={currentTitle} onValueChange={(newTitle) => updateUrlParams(1, currentPlatform, newTitle, currentUser)}>
          <SelectTrigger className="w-full bg-background">
            <SelectValue placeholder={t("filter.search_title")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filter.all_titles")}</SelectItem>
            {recordData?.titles.map((title) => (
              <SelectItem key={title} value={title}>
                {title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon" onClick={() => updateUrlParams(1, "all", "all", "all")}>
          <RefreshCcw />
        </Button>
      </div>

      <div className="border rounded-lg border shadow-xs bg-background">
        {recordData.records.length > 0
          ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-4 md:pl-6 py-4">{t("record.cover")}</TableHead>
                    <TableHead>{t("record.title")}</TableHead>
                    <TableHead>{t("record.platform")}</TableHead>
                    <TableHead>{t("record.user")}</TableHead>
                    <TableHead>{t("record.start_at")}</TableHead>
                    <TableHead>{t("record.end_at")}</TableHead>
                    <TableHead>{t("record.play_time")}</TableHead>
                    {/* <TableHead></TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recordData?.records.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="pl-4 md:pl-6 py-3 w-22">
                        <div className="rounded-sm size-12 overflow-hidden bg-muted">
                          {record.cover && (
                            <Image
                              src={record.cover}
                              alt={record.name}
                              width={64}
                              height={64}
                              priority
                              draggable="false"
                              onError={(e) => {
                                e.target.style.opacity = 0
                              }}
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {record.name}
                          <span className="text-xs text-muted-foreground/70">{record.titleId}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {record.platform === "NS"
                          ? <Badge className="bg-red-500 text-white">Switch</Badge>
                          : <Badge className="bg-blue-500 text-white">{record.platform}</Badge>}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.user === "unknown" ? t("filter.unknown_user") : record.user}</Badge>
                      </TableCell>
                      <TableCell>{new Date(record.startAt).toLocaleString()}</TableCell>
                      <TableCell>{new Date(record.endAt).toLocaleString()}</TableCell>
                      <TableCell>{`${record.playTime.minutes}分${record.playTime.seconds}秒`}</TableCell>
                      {/* <TableCell className="pr-4 md:pr-5 w-8">
                        <Button variant="ghost" size="icon">
                          <Trash2 />
                        </Button>
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )
          : (
              <p className="p-10 text-sm text-muted-foreground text-center">{t("record.no_records")}</p>
            )}
      </div>

      <Pagination page={currentPage} totalPages={recordData.pagination.totalPages} onChange={(newPage) => updateUrlParams(newPage, currentPlatform, currentTitle, currentUser)} />
    </div>
  )
}
