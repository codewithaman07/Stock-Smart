'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Newspaper,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Star
} from 'lucide-react';
import Link from 'next/link';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export default function Home() {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration - replace with real API calls
  useEffect(() => {
    const mockData: MarketData[] = [
      { symbol: 'AAPL', price: 185.42, change: 2.15, changePercent: 1.17 },
      { symbol: 'GOOGL', price: 142.38, change: -1.22, changePercent: -0.85 },
      { symbol: 'MSFT', price: 378.85, change: 4.32, changePercent: 1.15 },
      { symbol: 'TSLA', price: 248.50, change: -3.45, changePercent: -1.37 },
    ];
    
    setTimeout(() => {
      setMarketData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-primary p-8 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome to Stock Smart</h1>
              <p className="text-lg opacity-90 max-w-2xl">
                Your intelligent companion for stock market analysis and insights. 
                Make informed investment decisions with real-time data and AI-powered analytics.
              </p>
            </div>
            <div className="hidden lg:block animate-float">
              <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <BarChart3 className="w-16 h-16" />
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 mt-6">
            <Link href="/search">
              <Button size="lg" variant="secondary" className="gap-2">
                <Search className="w-4 h-4" />
                Search Stocks
              </Button>
            </Link>
            <Link href="/news">
              <Button size="lg" variant="outline" className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Newspaper className="w-4 h-4" />
                Latest News
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Market Cap</p>
                <p className="text-2xl font-bold">$45.2T</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Stocks</p>
                <p className="text-2xl font-bold">8,547</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gainers</p>
                <p className="text-2xl font-bold text-green-600">2,341</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Losers</p>
                <p className="text-2xl font-bold text-red-600">1,892</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between animate-pulse">
                    <div className="h-4 bg-muted rounded w-16"></div>
                    <div className="h-4 bg-muted rounded w-20"></div>
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </div>
                ))
              ) : (
                marketData.map((stock) => (
                  <div key={stock.symbol} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold">
                        {stock.symbol.slice(0, 2)}
                      </div>
                      <span className="font-medium">{stock.symbol}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${stock.price.toFixed(2)}</p>
                      <div className={`flex items-center gap-1 text-sm ${
                        stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stock.change >= 0 ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-blue-500" />
              Market Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gradient-card border">
                <h3 className="font-semibold mb-2">AI Market Analysis</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Get personalized insights powered by advanced AI algorithms analyzing market trends and patterns.
                </p>
                <Link href="/news/analysis/ai-insights">
                  <Button size="sm" className="gap-2">
                    <Eye className="w-4 h-4" />
                    View Analysis
                  </Button>
                </Link>
              </div>
              
              <div className="p-4 rounded-lg bg-gradient-card border">
                <h3 className="font-semibold mb-2">Trending Stocks</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Discover the most talked-about stocks in the market today.
                </p>
                <Link href="/search">
                  <Button size="sm" variant="outline" className="gap-2">
                    <Star className="w-4 h-4" />
                    Explore Trends
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/search" className="group">
              <div className="p-6 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all">
                <Search className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2">Search Stocks</h3>
                <p className="text-sm text-muted-foreground">
                  Find and analyze any stock with comprehensive data and insights.
                </p>
              </div>
            </Link>
            
            <Link href="/watchlist" className="group">
              <div className="p-6 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all">
                <Star className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2">My Watchlist</h3>
                <p className="text-sm text-muted-foreground">
                  Keep track of your favorite stocks and monitor their performance.
                </p>
              </div>
            </Link>
            
            <Link href="/news" className="group">
              <div className="p-6 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all">
                <Newspaper className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2">Market News</h3>
                <p className="text-sm text-muted-foreground">
                  Stay updated with the latest market news and analysis.
                </p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
