import { useTranslation } from "react-i18next"
import { tf } from "@/lib/utils"

export function TimeDisplay({ seconds }) {
  const { t } = useTranslation()
  const time = tf(seconds)

  if (seconds === 0) {
    return <span>0 {t("time.second")}</span>
  }

  return (
    <span>
      {time.hours > 0 && `${time.hours} ${t(time.hours === 1 ? "time.hour" : "time.hours")} `}
      {time.minutes > 0 && `${time.minutes} ${t(time.minutes === 1 ? "time.minute" : "time.minutes")} `}
      {time.seconds > 0 && `${time.seconds} ${t(time.seconds === 1 ? "time.second" : "time.seconds")}`}
    </span>
  )
}
