import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "./components/ui/Sidebar";
import { ThemeProvider } from './components/theme-provider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stock Smart",
  description: "Your intelligent stock market companion",
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
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 md:ml-64 transition-all duration-300">
              <main className="p-8">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
