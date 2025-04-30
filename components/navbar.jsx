"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";

export function NavBar() {
  const pathname = usePathname();

  if (pathname === "/login") {
    return null;
  }

  return (
    <nav className="flex justify-between items-center h-16 px-4 md:px-12 sticky top-0 z-50 border-b bg-background/90 backdrop-blur-sm">
      <Link href="/" className="text-lg font-bold">ゲーム時計</Link>
      <div className="flex items-center gap-8">
        <Link href="/settings">
          <Button variant="ghost" className="size-10"><Settings2 className="size-5" /></Button>
        </Link>
      </div>
    </nav>
  );
}
