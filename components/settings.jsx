import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Settings2, Gamepad2, CircleUser, Database } from "lucide-react"

export function Settings() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

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

  const [activeComponent, setActiveComponent] = useState(items[0].title)
  const CurrentComponent = items.find((item) => item.title === activeComponent)?.component

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="size-10">
          <Settings2 className="size-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="flex gap-0 p-0 h-[90vh] max-h-[720px] w-[80vw] sm:max-w-[1160px] overflow-hidden">
        <DialogTitle className="sr-only">{t("settings.title")}</DialogTitle>
        <div className="flex flex-col gap-6 p-3 w-60 bg-accent/70 border-r shrink-0">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-muted-foreground mx-[10px] my-1">{t("settings.menu.monitor")}</p>
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
            <p className="text-sm font-medium text-muted-foreground mx-[10px] my-1">{t("settings.menu.system")}</p>
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
          <Button size="sm" variant="destructive" className="mt-auto">{t("btn.logout")}</Button>
        </div>
        <div className="h-full p-8">
          <CurrentComponent />
        </div>
      </DialogContent>
    </Dialog>
  )
}

function PSMonitor() {
  return (
    <div className="w-full h-full">
      <p>PSMonitor</p>
    </div>
  )
}

function NSMonitor() {
  return (
    <div className="w-full h-full">
      <p>NSMonitor</p>
    </div>
  )
}

function SteamMonitor() {
  return (
    <div className="w-full h-full">
      <p>SteamMonitor</p>
    </div>
  )
}

function AccountManager() {
  return (
    <div className="w-full h-full">
      <p>AccountManager</p>
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
