import Image from "next/image"
import { useTranslation } from "react-i18next"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function RecordCard({ records }) {
  const { t } = useTranslation()
  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        {records?.records?.map((record, index) => (
          <div key={index}>
            {index > 0 && <Separator className="mb-4" />}
            <div className="flex flex-row gap-4 items-center">
              <Image
                src={record.cover}
                alt={record.name}
                className="rounded-sm object-cover size-14"
                width={64}
                height={64}
                priority
                draggable="false"
              />
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-bold">[{record.platform}] {record.name}</p>
                <p className="text-sm text-muted-foreground">
                  {t("home.last_gaming")}: {new Date(record.endAt).toLocaleString()} [
                  {record.playTime.minutes > 0 ? `${record.playTime.minutes} ${t("time.minutes")} ` : ""}
                  {record.playTime.seconds} {t("time.seconds")}]
                </p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
