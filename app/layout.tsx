import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "./components/ui/Sidebar";
import { ThemeProvider } from './components/theme-provider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stock Smart - AI Trading Assistant",
  description: "Your intelligent stock market companion powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen bg-background overflow-x-hidden">
            <Sidebar />
            <div className="flex-1 ml-0 md:ml-64 transition-all duration-300 min-w-0">
              <main className="p-4 pt-16 md:pt-8 md:p-8 w-full">
                <div className="min-h-[calc(100vh-4rem)] relative max-w-7xl mx-auto">
                  {/* Background decoration */}
                  <div className="fixed inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
                  <div className="relative z-10">
                    {children}
                  </div>
                </div>
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
