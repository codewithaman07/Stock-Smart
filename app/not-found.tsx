// app/not-found.tsx
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Home, Search, TrendingUp } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background px-4 md:pl-64 flex items-center justify-center">
      <div className="flex justify-center w-full">
        <Card className="w-full max-w-md text-center border border-border bg-muted/40 shadow-xl backdrop-blur-xl">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-red-200 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Page Not Found
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The page you’re looking for doesn’t exist. Maybe check your watchlist or try a search.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-primary text-white hover:bg-primary/90">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Go Home
                </Link>
              </Button>

              <Button asChild variant="outline" className="border-muted text-foreground hover:bg-muted/50">
                <Link href="/watchlist" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  View Watchlist
                </Link>
              </Button>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Try searching for a stock symbol or check your watchlist.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
