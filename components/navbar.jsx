"use client"

import Link from "next/link"
import { useState } from "react"
import { useTheme } from "next-themes"
import { useTranslation } from "react-i18next"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Languages, Sun, Moon, Settings2 } from "lucide-react"
import { Settings } from "@/components/settings/layout"
import { Logo } from "@/components/image"

export function NavBar() {
  const pathname = usePathname()
  const { setTheme } = useTheme()
  const { t, i18n } = useTranslation()
  const [openSettings, setOpenSettings] = useState(false)

  const handleLanguageChange = (value) => {
    i18n.changeLanguage(value)
  }

  if (pathname === "/login") {
    return null
  }

  return (
    <nav className="flex justify-between items-center h-16 px-4 md:px-12 sticky top-0 z-50 border-b bg-background/90 dark:bg-background backdrop-blur-sm">
      <Logo className="w-26 h-8 hidden md:block" />

      <div className="flex gap-2 ml-2 md:ml-0">
        <Link href="/" className="text-sm cursor-pointer">
          <Button variant="ghost" className={pathname === "/" ? "" : "font-normal text-muted-foreground/70"}>
            {t("navbar.overview")}
          </Button>
        </Link>
        <Link href="/record" className="text-sm cursor-pointer">
          <Button variant="ghost" className={pathname === "/record" ? "" : "font-normal text-muted-foreground/70"}>
            {t("navbar.record")}
          </Button>
        </Link>
        {/* <Link href="/report" className="text-sm cursor-pointer">{t("navbar.report")}</Link> */}
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-10">
              <Sun className="size-5 rotate-0 scale-100 dark:scale-0" />
              <Moon className="absolute size-5 scale-0 dark:scale-100" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")} className="text-sm">{t("theme.light")}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className="text-sm">{t("theme.dark")}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className="text-sm">{t("theme.system")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-10">
              <Languages className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleLanguageChange("en")} className="text-sm">English</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLanguageChange("zh")} className="text-sm">中文</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" className="size-10" onClick={() => setOpenSettings(true)}>
          <Settings2 className="size-5" />
        </Button>

        <Settings openSettings={openSettings} setOpenSettings={setOpenSettings} />
      </div>
    </nav>
  )
}
