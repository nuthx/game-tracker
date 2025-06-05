"use client"

import Link from "next/link"
import Image from "next/image"
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
import { Settings } from "@/components/settings"

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
      <Image src="/logo.svg" alt="ゲーム時計" width={110} height={25} draggable="false" className="hidden md:block" />

      <div className="flex gap-8 ml-2 md:ml-0">
        <Link href="/" className="text-sm cursor-pointer">{t("navbar.overview")}</Link>
        <Link href="/record" className="text-sm cursor-pointer">{t("navbar.record")}</Link>
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
