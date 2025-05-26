"use client"

import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useTranslation } from "react-i18next"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle
} from "@/components/ui/dialog"
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

  const handleLanguageChange = (value) => {
    i18n.changeLanguage(value)
  }

  if (pathname === "/login") {
    return null
  }

  return (
    <nav className="flex justify-between items-center h-16 px-4 md:px-12 sticky top-0 z-50 border-b bg-background/90 dark:bg-background backdrop-blur-sm">
      <Link href="/" className="cursor-pointer dark:invert fill-red-500 text-red-500">
        <Image src="/logo.svg" alt="ゲーム時計" width={110} height={25} draggable="false" />
      </Link>

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

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="size-10">
              <Settings2 className="size-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="flex gap-0 p-0 h-[90vh] max-h-[680px] w-[80vw] sm:max-w-[1080px] overflow-hidden">
            <DialogTitle className="sr-only">{t("settings.title")}</DialogTitle>
            <Settings />
          </DialogContent>
        </Dialog>
      </div>
    </nav>
  )
}
