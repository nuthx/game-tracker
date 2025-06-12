import Image from "next/image"
import { useState } from "react"
import { useTranslation, Trans } from "react-i18next"
import { FormInput, FormSelect } from "@/components/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ArrowRight } from "lucide-react"

export function PlayStationSettings({ configData, configMutate }) {
  const { t } = useTranslation()
  const [tutorialOpen, setTutorialOpen] = useState(false)

  return (
    <>
      {configData.psnNpsso && (
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
          <Avatar src={configData.psnMonitorFromAvatar} alt={configData.psnMonitorFromName} title={configData.psnMonitorFromName} subtitle={configData.psnMonitorFromId} />
          <ArrowRight className="size-5 text-muted-foreground shrink-0 rotate-90 md:rotate-0" />
          <Avatar src={configData.psnMonitorToAvatar} alt={configData.psnMonitorToName} title={configData.psnMonitorToName} subtitle={configData.psnMonitorToId} />
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <Label>{t("settings.psn.npsso")}</Label>
        <CardDescription>
          <Trans i18nKey="settings.psn.npsso_desc">
            <a className="underline cursor-pointer" onClick={() => setTutorialOpen(true)} />
          </Trans>
          <Dialog open={tutorialOpen} onOpenChange={setTutorialOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("settings.psn.tutorial.title")}</DialogTitle>
                <DialogDescription>{t("settings.psn.tutorial.desc")}</DialogDescription>
              </DialogHeader>
              <div className="flex gap-3">
                <Button className="flex-1" onClick={() => window.open("https://www.playstation.com", "_blank")}>{t("settings.psn.tutorial.btn1")}</Button>
                <Button className="flex-1" onClick={() => window.open("https://ca.account.sony.com/api/v1/ssocookie", "_blank")}>{t("settings.psn.tutorial.btn2")}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardDescription>
        <FormInput name="psnNpsso" placeholder={configData.psnNpsso} mutate={configMutate} clean={true} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>{t("settings.psn.monitor")}</Label>
        <CardDescription>{t("settings.psn.monitor_desc")}</CardDescription>
        <FormInput name="psnMonitorToId" defaultValue={configData.psnMonitorToId} placeholder={configData.psnMonitorToId} mutate={configMutate} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>{t("settings.psn.interval")}</Label>
        <CardDescription>{t("settings.psn.interval_desc")}</CardDescription>
        <FormSelect
          name="psnMonitorInterval"
          defaultValue={configData.psnMonitorInterval}
          options={[
            { value: 5, label: `5 ${t("time.seconds")}` },
            { value: 10, label: `10 ${t("time.seconds")}` },
            { value: 20, label: `20 ${t("time.seconds")}` },
            { value: 30, label: `30 ${t("time.seconds")}` },
            { value: 60, label: `60 ${t("time.seconds")}` }
          ]}
        />
      </div>
    </>
  )
}

function Avatar({ src, alt, title, subtitle }) {
  return (
    <div className="flex gap-3 md:gap-4 items-center border rounded-lg shadow-xs p-3 md:p-4 flex-1 w-full">
      <Image
        src={src}
        alt={alt}
        className="rounded-full size-10 md:size-14 object-cover shrink-0"
        width={56}
        height={56}
        priority
        draggable="false"
      />
      <div className="flex flex-col gap-0 md:gap-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  )
}
