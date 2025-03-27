import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/core/header";
import { ThemeProvider } from "@/components/shared/theme/theme-provider";
import { Toaster } from "@/components/shared/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CyberArk API Explorer",
  description: "Explorer et interagir avec les API CyberArk",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <footer className="border-t">
              <div className="container mx-auto p-4 text-center text-sm text-muted-foreground">
                <p>CyberArk API Explorer &copy; {new Date().getFullYear()}</p>
              </div>
            </footer>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
