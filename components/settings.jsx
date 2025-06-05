import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useTranslation, Trans } from "react-i18next"
import { useMediaQuery } from "@uidotdev/usehooks"
import { API } from "@/lib/http/api"
import { useData } from "@/lib/http/swr"
import { handleRequest } from "@/lib/http/request"
import { FormInput, FormSelect } from "@/components/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar } from "@/components/avatar"
import { ImportRecord, ExportRecord, DeleteRecord, ImportNxRecord } from "@/components/record-backup"
import { Gamepad2, CircleUser, Database, ArrowRight } from "lucide-react"

export function Settings({ openSettings, setOpenSettings }) {
  const router = useRouter()
  const { t } = useTranslation()
  const [activeComponent, setActiveComponent] = useState(t("settings.menu.psn"))
  const isMobile = useMediaQuery("(max-width: 767px)")

  const items = [
    {
      title: t("settings.menu.monitor")
    },
    {
      title: t("settings.menu.psn"),
      icon: Gamepad2,
      component: PSMonitor
    },
    {
      title: t("settings.menu.ns"),
      icon: Gamepad2,
      component: NSMonitor
    },
    {
      title: ""
    },
    {
      title: t("settings.menu.system")
    },
    {
      title: t("settings.menu.account"),
      icon: CircleUser,
      component: AccountManager
    },
    {
      title: t("settings.menu.record"),
      icon: Database,
      component: RecordManager
    }
  ]

  const handleLogout = async () => {
    const result = await handleRequest("DELETE", API.LOGOUT)
    if (result.ok) {
      router.push("/login")
      router.refresh()
    } else {
      toast.error(`[${result.code}] ${result.message}`)
    }
  }

  if (isMobile) {
    return (
      <Drawer open={openSettings} onOpenChange={setOpenSettings}>
        <DrawerContent className="h-[90vh]">
          <DrawerHeader className="border-b">
            <DrawerTitle className="sr-only">{t("settings.title")}</DrawerTitle>
            <Select value={activeComponent} onValueChange={setActiveComponent}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {items.map((item) => (
                  item.component && (
                    <SelectItem key={item.title} value={item.title}>
                      <item.icon className="size-4 mr-1" />
                      {item.title}
                    </SelectItem>
                  )
                ))}
              </SelectContent>
            </Select>
          </DrawerHeader>
          <DrawerFooter className="flex flex-col gap-8 m-0 overflow-y-auto">
            <CurrentComponent items={items} activeComponent={activeComponent} />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={openSettings} onOpenChange={setOpenSettings}>
      <DialogContent className="flex gap-0 p-0 h-[90vh] max-h-[680px] w-[90vw] sm:max-w-[1080px] overflow-hidden">
        <DialogTitle className="sr-only">{t("settings.title")}</DialogTitle>
        <div className="flex flex-col gap-1 p-3 w-60 bg-accent/70 border-r shrink-0">
          {items.map((item) => (
            item.component
              ? (
                  <Button
                    key={item.title}
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start font-normal hover:bg-neutral-200/70 ${activeComponent === item.title ? "bg-neutral-200/70" : ""}`}
                    onClick={() => setActiveComponent(item.title)}
                  >
                    <item.icon className="size-4 mr-1" />
                    {item.title}
                  </Button>
                )
              : (
                  <p key={item.title} className="text-sm font-bold text-muted-foreground mx-3 my-1">
                    {item.title}
                  </p>
                )
          ))}
          <Button size="sm" variant="destructive" className="mt-auto" onClick={handleLogout}>{t("btn.logout")}</Button>
        </div>
        <div className="flex flex-col gap-8 w-full p-10 overflow-y-auto">
          <CurrentComponent items={items} activeComponent={activeComponent} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CurrentComponent({ items, activeComponent }) {
  const { t } = useTranslation()
  const CurrentComponent = items.find((item) => item.title === activeComponent)?.component
  const { data: configData, error: configError, isLoading: configLoading, mutate: configMutate } = useData(API.CONFIG)

  if (configLoading) {
    return <></>
  }

  if (configError) {
    return <p className="text-sm text-muted-foreground text-center">{t("toast.error_config")}</p>
  }

  return (
    <CurrentComponent configData={configData} configMutate={configMutate} />
  )
}

function PSMonitor({ configData, configMutate }) {
  const { t } = useTranslation()
  const [tutorialOpen, setTutorialOpen] = useState(false)

  return (
    <>
      {configData.npsso && (
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
          <Avatar src={configData.avatar} alt={configData.onlineId} title={configData.onlineId} subtitle={configData.accountId} />
          <ArrowRight className="size-5 text-muted-foreground shrink-0 rotate-90 md:rotate-0" />
          <Avatar src={configData.monitorAvatar} alt={configData.monitorName} title={configData.monitorName} subtitle={configData.monitorId} />
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
                <Button className="flex-1">{t("settings.psn.tutorial.btn1")}</Button>
                <Button className="flex-1">{t("settings.psn.tutorial.btn2")}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardDescription>
        <FormInput name="new_npsso" schema="npsso" placeholder={configData.npsso} mutate={configMutate} clean={true} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>{t("settings.psn.monitor")}</Label>
        <CardDescription>{t("settings.psn.monitor_desc")}</CardDescription>
        <FormInput name="new_monitorId" defaultValue={configData.monitorId} placeholder={configData.monitorId} mutate={configMutate} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>{t("settings.psn.interval")}</Label>
        <CardDescription>{t("settings.psn.interval_desc")}</CardDescription>
        <FormSelect
          name="new_monitorInterval"
          defaultValue={configData.monitorInterval}
          options={[
            { value: "5", label: `5 ${t("time.seconds")}` },
            { value: "10", label: `10 ${t("time.seconds")}` },
            { value: "20", label: `20 ${t("time.seconds")}` },
            { value: "30", label: `30 ${t("time.seconds")}` },
            { value: "60", label: `60 ${t("time.seconds")}` }
          ]}
        />
      </div>
    </>
  )
}

function NSMonitor() {
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

function AccountManager({ configData }) {
  const { t } = useTranslation()

  // 获取 cookie 的过期时间
  const getCookieExpiry = () => {
    const cookies = document.cookie.split(";")
    const tktkCookie = cookies.find((cookie) => cookie.trim().startsWith("tktk="))
    try {
      const token = tktkCookie.split("=")[1]
      const payload = JSON.parse(atob(token.split(".")[1]))
      return new Date(payload.exp * 1000)
    } catch {
      return null
    }
  }

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label>{t("settings.account.username")}</Label>
        <CardDescription>{t("settings.account.username_desc")}</CardDescription>
        <FormInput name="new_username" schema="username" defaultValue={configData.username} placeholder={configData.username} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>{t("settings.account.password")}</Label>
        <CardDescription>{t("settings.account.password_desc")}</CardDescription>
        <FormInput name="new_password" schema="password" placeholder={t("settings.account.password_new")} clean={true} />
      </div>
      {getCookieExpiry() && (
        <div className="flex flex-col gap-1.5">
          <Label>{t("settings.account.expiry")}</Label>
          <CardDescription>{t("settings.account.expiry_desc")}</CardDescription>
          <Input value={getCookieExpiry().toLocaleString()} disabled />
        </div>
      )}
    </>
  )
}

function RecordManager() {
  const { t } = useTranslation()
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>{t("settings.record.export")}</Label>
          <CardDescription>{t("settings.record.export_desc")}</CardDescription>
        </div>
        <ExportRecord />
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>{t("settings.record.import")}</Label>
          <CardDescription>{t("settings.record.import_desc")}</CardDescription>
        </div>
        <ImportRecord />
      </div>
      <Separator />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>{t("settings.record.delete")}</Label>
          <CardDescription>{t("settings.record.delete_desc")}</CardDescription>
        </div>
        <DeleteRecord />
      </div>
    </>
  )
}
