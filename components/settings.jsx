import Image from "next/image"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { API } from "@/lib/http/api"
import { useData } from "@/lib/http/swr"
import { handleRequest } from "@/lib/http/request"
import { FormInput, FormSelect } from "@/components/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar } from "@/components/avatar"
import { Gamepad2, CircleUser, Database, ArrowRight } from "lucide-react"

export function Settings() {
  const router = useRouter()
  const { t } = useTranslation()
  const [activeComponent, setActiveComponent] = useState(t("settings.menu.psn"))

  const items = [
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
      title: t("settings.menu.steam"),
      icon: Gamepad2,
      component: SteamMonitor
    },
    {
      title: t("settings.menu.account"),
      icon: CircleUser,
      component: AccountManager
    },
    {
      title: t("settings.menu.backup"),
      icon: Database,
      component: Backup
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

  return (
    <>
      <div className="flex flex-col gap-6 p-3 w-60 bg-accent/70 border-r shrink-0">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold text-muted-foreground mx-[10px] my-1">{t("settings.menu.monitor")}</p>
          {items.slice(0, 3).map((item) => (
            <Button
              key={item.title}
              variant="ghost"
              size="sm"
              className={`w-full justify-start font-normal hover:bg-neutral-200/70 ${
                activeComponent === item.title ? "bg-neutral-200/70" : ""}
              `}
              onClick={() => setActiveComponent(item.title)}
            >
              <item.icon className="size-4 mr-1" />
              {item.title}
            </Button>
          ))}
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold text-muted-foreground mx-[10px] my-1">{t("settings.menu.system")}</p>
          {items.slice(3).map((item) => (
            <Button
              key={item.title}
              variant="ghost"
              size="sm"
              className={`w-full justify-start font-normal hover:bg-neutral-200/70 ${
                activeComponent === item.title ? "bg-neutral-200/70" : ""}
              `}
              onClick={() => setActiveComponent(item.title)}
            >
              <item.icon className="size-4 mr-1" />
              {item.title}
            </Button>
          ))}
        </div>
        <Button size="sm" variant="destructive" className="mt-auto" onClick={handleLogout}>{t("btn.logout")}</Button>
      </div>
      <div className="flex flex-col gap-8 w-full h-full px-12 py-10 overflow-y-auto">
        <CurrentComponent items={items} activeComponent={activeComponent} />
      </div>
    </>
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
  return (
    <>
      {configData.npsso && (
        <div className="flex gap-4 items-center">
          <Avatar src={configData.avatar} alt={configData.onlineId} title={configData.onlineId} subtitle={configData.accountId} />
          <ArrowRight className="size-5 text-muted-foreground" />
          <Avatar src={configData.monitorAvatar} alt={configData.monitorName} title={configData.monitorName} subtitle={configData.monitorId} />
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <Label>{t("settings.psn.npsso")}</Label>
        <CardDescription>{t("settings.psn.npsso_desc")}</CardDescription>
        <FormInput name="new_npsso" schema="npsso" placeholder={configData.npsso} mutate={configMutate} />
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
          mutate={configMutate}
        />
      </div>
    </>
  )
}

function NSMonitor() {
  return (
    <>
      <Card>
        <CardContent>
          <CardTitle>监控用户设置</CardTitle>
          <p>Card Content</p>
        </CardContent>
      </Card>
    </>
  )
}

function SteamMonitor({ configData }) {
  return (
    <>
      {configData.npsso && (
        <div className="flex gap-4 items-center">
          <Avatar src={configData.avatar} alt={configData.onlineId} title={configData.onlineId} subtitle={configData.accountId} />
          <ArrowRight className="size-5 text-muted-foreground" />
          <Avatar src={configData.monitorAvatar} alt={configData.monitorName} title={configData.monitorName} subtitle={configData.monitorId} />
        </div>
      )}
      <div className="flex flex-col gap-5">
        <div className="border-b pb-3 space-y-2">
          <CardTitle>登录用户设置</CardTitle>
        </div>
        <div className="flex flex-col gap-1">
          <Label>请输入NPSSO</Label>
          <FormInput name="new_npsso" schema="npsso" placeholder={configData.npsso} />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="border-b pb-3 space-y-2">
          <CardTitle>监控用户设置</CardTitle>
          <CardDescription>可填写并监控其他账号的游戏状态，请确保该用户的游戏状态对登录用户可见。</CardDescription>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">AccountID</p>
          <FormInput name="new_monitorId" defaultValue={configData.monitorId} placeholder={configData.monitorId} />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">监控间隔</p>
          <FormInput name="new_monitorInterval" defaultValue={configData.monitorInterval} placeholder={configData.monitorInterval} />
        </div>
      </div>
    </>
  )
}

function AccountManager({ configData }) {
  return (
    <div className="w-full h-full">
      <p>AccountManager</p>
      <FormInput name="new_username" schema="username" defaultValue={configData.username} placeholder={configData.username} />
    </div>
  )
}

function Backup() {
  return (
    <div className="w-full h-full">
      <p>Backup</p>
    </div>
  )
}
