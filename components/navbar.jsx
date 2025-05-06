"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings2, Sun, Moon } from "lucide-react";

export function NavBar() {
  const pathname = usePathname();
  const { setTheme } = useTheme();

  if (pathname === "/login") {
    return null;
  }

  return (
    <nav className="flex justify-between items-center h-16 px-4 md:px-12 sticky top-0 z-50 border-b bg-background/90 dark:bg-background backdrop-blur-sm">
      <Link href="/" className="text-lg font-bold">ゲーム時計</Link>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-10">
              <Sun className="size-5 rotate-0 scale-100 dark:scale-0" />
              <Moon className="absolute size-5 scale-0 dark:scale-100" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")} className="text-sm">浅色</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className="text-sm">深色</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className="text-sm">跟随系统</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link href="/settings">
          <Button variant="ghost" className="size-10"><Settings2 className="size-5" /></Button>
        </Link>
      </div>
    </nav>
  );
}
