"use client"

import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import { API } from "@/lib/http/api"
import { useData } from "@/lib/http/swr"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { TimeDisplay } from "@/components/time"

export function RecentCard() {
  const { t } = useTranslation()

  const { data: recordData, error: recordError, isLoading: recordLoading } = useData(`${API.RECORD}?limit=10`)

  if (recordLoading) {
    return (
      <div className="p-10 bg-background border rounded-xl shadow-xs">
        <p className="text-sm text-muted-foreground text-center">{t("toast.loading")}</p>
      </div>
    )
  }

  if (recordError) {
    return (
      <div className="p-10 bg-background border rounded-xl shadow-xs">
        <p className="text-sm text-muted-foreground text-center">{t("toast.error_user")}</p>
      </div>
    )
  }

  if (recordData.records.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="p-3 md:p-6 border rounded-xl border shadow-xs bg-background">
        {recordData.records.map((record, index) => (
          <div key={record.id}>
            {index > 0 && <Separator className="my-4" />}
            <div className="flex flex-row gap-4 items-center">
              <div className="rounded-sm size-14 overflow-hidden bg-muted">
                {record.game.imageIcon && (
                  <Image
                    src={record.game.imageIcon}
                    alt={record.game.title}
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
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-bold">[{record.platform.name}] {record.game.title}</p>
                <p className="text-sm text-muted-foreground">
                  {t("home.last_gaming")}
                  :
                  {new Date(record.endAt).toLocaleString()}
                  {" "}
                  [
                  <TimeDisplay seconds={record.playSeconds} />
                  ]
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Link href="/record" className="w-full">
        <Button variant="ghost" className="w-full">
          {t("home.view_all")}
        </Button>
      </Link>
    </div>
  )
}
