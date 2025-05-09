import "@/app/globals.css"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { I18nWrapper } from "@/i18n/wrapper"
import { Toaster } from "@/components/ui/sonner"
import { NavBar } from "@/components/navbar"

export const metadata = {
  title: "ゲーム時計"
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-accent/50 overflow-y-scroll">
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <I18nWrapper>
            <NavBar />
            <div className="container mx-auto max-w-screen-lg flex flex-col gap-4 p-4 md:p-8">
              {children}
            </div>
            <Toaster position="top-center" />
          </I18nWrapper>
        </NextThemesProvider>
      </body>
    </html>
  )
}
