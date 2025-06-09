import Image from "next/image"
import { useTranslation } from "react-i18next"
import { Separator } from "@/components/ui/separator"
import { TimeDisplay } from "@/components/time"

export function RecordCard({ records }) {
  const { t } = useTranslation()
  return (
    <div className="p-3 md:p-6 border rounded-lg border shadow-xs bg-background">
      {records?.records?.map((record, index) => (
        <div key={index}>
          {index > 0 && <Separator className="my-4" />}
          <div className="flex flex-row gap-4 items-center">
            <div className="rounded-sm size-14 overflow-hidden bg-muted">
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
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-bold">[{record.platform}] {record.name}</p>
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
  )
}
