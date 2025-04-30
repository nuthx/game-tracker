import "@/app/globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner"
import { Settings2 } from "lucide-react";

export const metadata = {
  title: "ゲーム時計",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-accent/50 overflow-y-scroll">
        <nav className="flex justify-between items-center h-16 px-4 md:px-12 sticky top-0 z-50 border-b bg-background/90 backdrop-blur-sm">
          <Link href="/" className="text-lg font-bold">ゲーム時計</Link>
          <div className="flex items-center gap-8">
            <Link href="/settings">
              <Button variant="ghost" className="size-10"><Settings2 className="size-5" /></Button>
            </Link>
          </div>
        </nav>
        <div className="container mx-auto max-w-screen-lg flex flex-col gap-4 p-4 md:p-8">
          {children}
        </div>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
