import { useTranslation } from "react-i18next"

export function TimeDisplay({ seconds }) {
  const { t } = useTranslation()

  if (seconds === 0) {
    return <span>0 {t("time.second")}</span>
  }

  const tHours = Math.floor(seconds / 3600)
  const tMinutes = Math.floor((seconds % 3600) / 60)
  const tSeconds = seconds % 60

  return (
    <span>
      {tHours > 0 && `${tHours} ${t(tHours === 1 ? "time.hour" : "time.hours")}`}
      {tHours > 0 && tMinutes > 0 && tSeconds > 0 && " "}
      {tMinutes > 0 && `${tMinutes} ${t(tMinutes === 1 ? "time.minute" : "time.minutes")}`}
      {tMinutes > 0 && tSeconds > 0 && " "}
      {tSeconds > 0 && `${tSeconds} ${t(tSeconds === 1 ? "time.second" : "time.seconds")}`}
    </span>
  )
}
