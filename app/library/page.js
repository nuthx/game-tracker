"use client"

import dayjs from "dayjs"
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
import { Clock4, CalendarCheck } from "lucide-react"
import { Pagination } from "@/components/pagination"
import { HourDisplay } from "@/components/time"
import { Image } from "@/components/image"

export default function Page() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get("page")) || 1

  const updateUrlParams = (newPage) => {
    const params = new URLSearchParams()
    if (newPage > 1) {
      params.set("page", newPage.toString())
    }
    const queryString = params.toString()
    router.push(queryString ? `?${queryString}` : "/library")
  }

  const { data: libraryData, error: libraryError, isLoading: libraryLoading } = useData(`${API.LIBRARY}?page=${currentPage}`)

  if (libraryLoading) {
    return <div className="flex justify-center text-sm text-muted-foreground">{t("toast.loading")}</div>
  }

  if (libraryError) {
    return <div className="flex justify-center text-sm text-muted-foreground">{t("toast.error_load")}</div>
  }

  return (
    <div className="max-w-screen-lg mx-auto flex flex-col gap-2 md:gap-4">
      {libraryData.games.length > 0
        ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {libraryData?.games.map((game, index) => (
                <div key={index} className="flex border rounded-lg shadow-xs bg-background overflow-hidden">
                  <Image src={game.imageIcon} alt={game.title} className="size-30" />
                  <div className="flex flex-col gap-2 px-4 pt-4 pb-2.5">
                    <div className="flex gap-1.5">
                      {game.platform.map((platform) => (
                        <Badge key={platform.id} className="text-white" style={{ backgroundColor: platform.color }}>{platform.name}</Badge>
                      ))}
                      {game.releaseDate && (
                        <Badge variant="outline">{dayjs(game.releaseDate).format("YYYY-MM-DD")}</Badge>
                      )}
                    </div>

                    <p className="text-sm font-medium truncate w-full">{game.title}</p>

                    <div className="flex gap-6 text-sm text-muted-foreground mt-auto">
                      {game.userPlaySeconds > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Clock4 className="size-4" />
                          <HourDisplay seconds={game.userPlaySeconds} />
                        </div>
                      )}
                      {game.userEndAt && (
                        <div className="flex items-center gap-1.5">
                          <CalendarCheck className="size-4" />
                          {dayjs(game.userEndAt).format("YYYY-MM-DD")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        : (
            <div className="border rounded-lg shadow-xs bg-background">
              <p className="p-10 text-sm text-muted-foreground text-center">{t("toast.no_games")}</p>
            </div>
          )}

      <Pagination page={currentPage} totalPages={libraryData.pagination.totalPages} onChange={(newPage) => updateUrlParams(newPage)} />
    </div>
  )
}
