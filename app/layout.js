import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner"
import { NavBar } from "@/components/navbar";

export const metadata = {
  title: "ゲーム時計",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-accent/50 overflow-y-scroll">
        <NavBar />
        <div className="container mx-auto max-w-screen-lg flex flex-col gap-4 p-4 md:p-8">
          {children}
        </div>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
