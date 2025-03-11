'use client';

import { cn } from "../../../lib/utils";
import { Button } from "@/app/components/ui/button";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { 
  LineChart, 
  Newspaper, 
  TrendingUp, 
  Search, 
  Settings,
  Bookmark,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const sidebarNavItems = [
  {
    title: "Market Overview",
    href: "/",
    icon: LineChart,
  },
  {
    title: "Stock News",
    href: "/news",
    icon: Newspaper,
  },
  {
    title: "Hot Stocks",
    href: "/hot-stocks",
    icon: TrendingUp,
  },
  {
    title: "Search Stocks",
    href: "/search",
    icon: Search,
  },
  {
    title: "Watchlist",
    href: "/watchlist",
    icon: Bookmark,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      <div
        className={cn(
          "fixed top-0 left-0 h-screen flex flex-col border-r bg-gray-50 transition-all duration-300 ease-in-out z-40",
          isOpen ? "w-64" : "w-16"
        )}
      >
        <div className="p-4 flex items-center justify-between">
          {isOpen && <h1 className="text-xl font-bold text-gray-800">Stock Smart</h1>}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {sidebarNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-2",
                      pathname === item.href && "bg-gray-200"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {isOpen && <span>{item.title}</span>}
                  </Button>
                </Link>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
} 