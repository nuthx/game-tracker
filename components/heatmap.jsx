import { API } from "@/lib/http/api"
import { useData } from "@/lib/http/swr"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useMeasure, useMediaQuery } from "@uidotdev/usehooks"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { TimeDisplay } from "@/components/time"

export function Heatmap() {
  const { t } = useTranslation()
  const [containerRef, { width }] = useMeasure()
  const [numWeeks, setNumWeeks] = useState(0)
  const isMobile = useMediaQuery("(max-width: 767px)")

  const { data: weeklyData, error: heatmapError } = useData(API.HEATMAP)

  // 计算可显示的最大周数
  useEffect(() => {
    if (isMobile) {
      setNumWeeks(Math.floor((width - 24) / 15))
    } else {
      setNumWeeks(Math.floor((width - 48) / 15))
    }
  }, [width, isMobile])

  if (heatmapError) {
    return (
      <div className="p-10 bg-background border rounded-xl shadow-xs">
        <p className="text-sm text-muted-foreground text-center">{t("toast.error_heatmap")}</p>
      </div>
    )
  }

  return (
    <div className="p-3 md:p-6 bg-background border rounded-xl shadow-xs" ref={containerRef}>
      <div className="flex gap-[3px]">
        {weeklyData?.slice(-numWeeks)?.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-[3px]">
            {week.map((day, dayIndex) => (
              <HeatmapHover key={dayIndex} day={day} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function HeatmapHover({ day }) {
  const { t } = useTranslation()
  const getColor = (percent) => {
    if (percent === 0) {
      return "bg-muted"
    } else if (percent < 20) {
      return "bg-primary/30"
    } else if (percent < 40) {
      return "bg-primary/45"
    } else if (percent < 60) {
      return "bg-primary/60"
    } else if (percent < 80) {
      return "bg-primary/75"
    } else {
      return "bg-primary/90"
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className={`size-3 rounded-xs transition-all hover:ring-2 hover:ring-offset-1 hover:ring-primary/50 cursor-pointer ${getColor(day.total.percent)}`} />
        </TooltipTrigger>
        <TooltipContent className="flex flex-col gap-2 text-xs">
          <p className="font-medium">{new Date(day.date).toLocaleDateString()}</p>
          <Separator className="bg-muted/30" />
          <div className="flex gap-4 justify-between">
            <p>{t("filter.psn")}</p>
            <TimeDisplay seconds={day.psn.value} />
          </div>
          <div className="flex gap-4 justify-between">
            <p>{t("filter.nx")}</p>
            <TimeDisplay seconds={day.nx.value} />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
