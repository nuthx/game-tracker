import { useTranslation } from "react-i18next"
import { CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ImportNxRecord } from "@/components/record-backup"

export function SwitchSettings() {
  const { t } = useTranslation()
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label>{t("settings.ns.import")}</Label>
        <CardDescription className="mb-3">{t("settings.ns.import_desc")}</CardDescription>
        <ImportNxRecord />
      </div>
    </>
  )
}
