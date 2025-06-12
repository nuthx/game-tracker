import pkg from "@/package.json"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useMediaQuery } from "@uidotdev/usehooks"
import { API } from "@/lib/http/api"
import { useData } from "@/lib/http/swr"
import { handleRequest } from "@/lib/http/request"
import {
  Dialog,
  DialogContent,
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
import { Button } from "@/components/ui/button"
import { Gamepad2, CircleUser, Database, LogOut } from "lucide-react"
import { PlayStationSettings } from "@/components/settings/ps"
import { SwitchSettings } from "@/components/settings/ns"
import { AccountSettings } from "@/components/settings/account"
import { DataSettings } from "@/components/settings/data"

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
      component: PlayStationSettings
    },
    {
      title: t("settings.menu.ns"),
      icon: Gamepad2,
      component: SwitchSettings
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
      component: AccountSettings
    },
    {
      title: t("settings.menu.record"),
      icon: Database,
      component: DataSettings
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
          <DrawerHeader className="flex-row gap-2 border-b">
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
            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut />
            </Button>
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
        <div className="flex flex-col justify-between p-3 w-60 bg-accent/70 border-r shrink-0">
          <div className="flex flex-col gap-1">
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
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground">{t("settings.version")}: {pkg.version}</p>
            <Button size="sm" variant="destructive" className="w-full" onClick={handleLogout}>
              <LogOut />
              {t("btn.logout")}
            </Button>
          </div>
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
