'use client';

import { cn } from "../../../lib/utils";
import { Button } from "@/app/components/ui/button";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { 
  Newspaper, 
  TrendingUp, 
  Search, 
  Settings,
  Bookmark,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Home,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Market Analysis",
    href: "/market",
    icon: BarChart3,
  },
  {
    title: "Stock News",
    href: "/news",
    icon: Newspaper,
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
  const [isOpen, setIsOpen] = useState(false); // Start closed on mobile
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(true); // Always open on desktop
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [pathname, isMobile]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden glass backdrop-blur-sm border border-white/20"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <div
        className={cn(
          "fixed top-0 left-0 h-screen flex flex-col border-r bg-background/95 backdrop-blur-xl transition-all duration-300 ease-in-out z-40",
          // Mobile behavior
          isMobile 
            ? (isOpen ? "w-64" : "-translate-x-full w-64")
            : (isOpen ? "w-64" : "w-16"),
          "max-w-[90vw]" // Ensure sidebar never exceeds 90% of viewport width
        )}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            {isOpen && (
              <div>
                <h1 className="text-lg font-bold">Stock Smart</h1>
                <p className="text-xs text-muted-foreground">AI Trading Assistant</p>
              </div>
            )}
          </div>
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1">
          <div className="space-y-2 p-3">
            {sidebarNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                  <Link key={item.href} href={item.href} className="cursor-pointer">
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 h-11 relative group transition-all duration-200 cursor-pointer",
                      isActive 
                        ? "bg-gradient-primary text-white shadow-md" 
                        : "hover:bg-muted/50 hover:translate-x-1",
                      !isOpen && !isMobile && "px-0 justify-center"
                    )}
                  >
                    <Icon className={cn(
                      "h-5 w-5 transition-all cursor-pointer",
                      isActive && "drop-shadow-sm"
                    )} />
                    {isOpen && (
                      <span className="font-medium cursor-pointer">
                        {item.title}
                      </span>
                    )}
                    {/* Active indicator */}
                    {isActive && isOpen && (
                      <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse-soft cursor-pointer" />
                    )}
                    {/* Tooltip for collapsed state */}
                    {!isOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 cursor-pointer">
                        {item.title}
                      </div>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t bg-muted/20">
          {isOpen ? (
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Market Status</p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-600">Markets Open</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

// Custom hook to manage watchlist in localStorage
export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("watchlist");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  return [watchlist, setWatchlist] as const;
}