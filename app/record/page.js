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
import { RefreshCcw } from "lucide-react"
import { Pagination } from "@/components/pagination"
import { TimeDisplay } from "@/components/time"
import { Image } from "@/components/image"

export default function Page() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get("page")) || 1
  const currentPlatform = searchParams.get("platform") || "all"
  const currentGame = searchParams.get("game") || "all"
  const currentPlayer = searchParams.get("player") || "all"

  const updateUrlParams = (newPage, newPlatform, newGame, newPlayer) => {
    const params = new URLSearchParams()
    if (newPage > 1) {
      params.set("page", newPage.toString())
    }
    if (newPlatform !== "all") {
      params.set("platform", newPlatform)
    }
    if (newGame !== "all") {
      params.set("game", newGame)
    }
    if (newPlayer !== "all") {
      params.set("player", newPlayer)
    }
    const queryString = params.toString()
    router.push(queryString ? `?${queryString}` : "/record")
  }

  const { data: recordData, error: recordError, isLoading: recordLoading } = useData(
    `${API.RECORD_DATA}?page=${currentPage}&limit=50&platform=${currentPlatform}&game=${currentGame}&player=${currentPlayer}`
  )

  const { data: listData, error: listError, isLoading: listLoading } = useData(API.RECORD_LIST)

  if (recordLoading || listLoading) {
    return <div className="flex justify-center text-sm text-muted-foreground">{t("toast.loading")}</div>
  }

  if (recordError || listError) {
    return <div className="flex justify-center text-sm text-muted-foreground">{t("toast.error_user")}</div>
  }

  return (
    <div className="max-w-screen-2xl mx-auto flex flex-col gap-2 md:gap-4">
      <div className="flex gap-2 md:gap-3 items-center justify-end">
        <Select value={currentPlatform} onValueChange={(newPlatform) => updateUrlParams(1, newPlatform, currentGame, currentPlayer)}>
          <SelectTrigger className="w-full bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("record.filter.all_platforms")}</SelectItem>
            {listData?.platforms.map((platform) => (
              <SelectItem key={platform} value={platform}>
                {platform}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={currentPlayer} onValueChange={(newPlayer) => updateUrlParams(1, currentPlatform, currentGame, newPlayer)}>
          <SelectTrigger className="w-full bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("record.filter.all_players")}</SelectItem>
            {listData?.players.map((player) => (
              <SelectItem key={player} value={player}>
                {player}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={currentGame} onValueChange={(newGame) => updateUrlParams(1, currentPlatform, newGame, currentPlayer)}>
          <SelectTrigger className="w-full bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("record.filter.all_games")}</SelectItem>
            {listData?.games.map((game) => (
              <SelectItem key={game} value={game}>
                {game}
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
                    <TableHead className="pl-4 md:pl-6 py-4">{t("record.table.cover")}</TableHead>
                    <TableHead>{t("record.table.name")}</TableHead>
                    <TableHead>{t("record.table.platform")}</TableHead>
                    <TableHead>{t("record.table.player")}</TableHead>
                    <TableHead>{t("record.table.start_at")}</TableHead>
                    <TableHead>{t("record.table.end_at")}</TableHead>
                    <TableHead>{t("record.table.play_time")}</TableHead>
                    {/* <TableHead></TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recordData?.records.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="pl-4 md:pl-6 py-3 w-22">
                        <Image src={record.game.imageIcon} alt={record.game.title} className="rounded-sm size-12" />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {record.game?.title}
                          <span className="text-xs text-muted-foreground/70">{record.game?.gameId}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="text-white" style={{ backgroundColor: record.platform?.color }}>{record.platform?.name}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.player}</Badge>
                      </TableCell>
                      <TableCell>
                        {dayjs(record.startAt).format("YYYY-MM-DD HH:mm:ss")}
                      </TableCell>
                      <TableCell>
                        {dayjs(record.endAt).format("YYYY-MM-DD HH:mm:ss")}
                      </TableCell>
                      <TableCell>
                        <TimeDisplay seconds={record.playSeconds} />
                      </TableCell>
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
              <p className="p-10 text-sm text-muted-foreground text-center">{t("toast.no_records")}</p>
            )}
      </div>

      <Pagination page={currentPage} totalPages={recordData.pagination.totalPages} onChange={(newPage) => updateUrlParams(newPage, currentPlatform, currentGame, currentPlayer)} />
    </div>
  )
}
