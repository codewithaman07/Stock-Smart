'use client';

import { useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card} from '../components/ui/card';
import { 
  Search,  
  TrendingUp, 
  TrendingDown, 
  Star,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import Link from 'next/link';

interface StockResult {
  symbol: string;
  shortName: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  currency: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StockResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('watchlist');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const searchStocks = async () => {
    if (!query) return;

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResults(data);
    } catch (err) {
      setError('Failed to fetch stock data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      const newWatchlist = [...watchlist, symbol];
      setWatchlist(newWatchlist);
      localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Stock Search</h1>
        <p className="text-muted-foreground">
          Find and analyze stocks with real-time market data
        </p>
      </div>
      
      {/* Search Bar */}
      <Card className="p-6 bg-gradient-card">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter stock symbol or company name (e.g., AAPL, Tesla)..."
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && searchStocks()}
              className="pl-10 h-12 text-lg"
            />
          </div>
          <Button onClick={searchStocks} disabled={loading} size="lg" className="px-8">
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </Card>

      {error && (
        <Card className="p-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </Card>
      )}

      {loading && (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-2">
                  <div className="h-6 bg-muted rounded w-32"></div>
                  <div className="h-4 bg-muted rounded w-48"></div>
                </div>
                <div className="h-8 bg-muted rounded w-24"></div>
              </div>
              <div className="h-4 bg-muted rounded w-20"></div>
            </Card>
          ))}
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid gap-4">
          {results.map((stock) => (
            <Card key={stock.symbol} className="hover-lift group overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-lg">
                      {stock.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {stock.symbol}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-1">
                        {stock.shortName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {stock.regularMarketPrice.toFixed(2)} {stock.currency}
                    </div>
                    <div className={`flex items-center gap-1 justify-end ${
                      stock.regularMarketChange >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stock.regularMarketChange >= 0 ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      <span className="font-medium">
                        {stock.regularMarketChange >= 0 ? '+' : ''}
                        {stock.regularMarketChange.toFixed(2)} ({stock.regularMarketChangePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    {stock.regularMarketChange >= 0 ? (
                      <div className="flex items-center gap-1 text-green-600 text-sm">
                        <TrendingUp className="w-4 h-4" />
                        Bullish
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600 text-sm">
                        <TrendingDown className="w-4 h-4" />
                        Bearish
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        addToWatchlist(stock.symbol);
                      }}
                      disabled={watchlist.includes(stock.symbol)}
                      className="gap-2"
                    >
                      <Star className={`w-4 h-4 ${watchlist.includes(stock.symbol) ? 'fill-current' : ''}`} />
                      {watchlist.includes(stock.symbol) ? 'Added' : 'Watchlist'}
                    </Button>
                    
                    <Link href={`/stock/${stock.symbol}`}>
                      <Button size="sm" className="gap-2">
                        <Eye className="w-4 h-4" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <Card className="p-12 text-center">
          <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No stocks found</h3>
          <p className="text-muted-foreground">
            Try searching with a different stock symbol or company name
          </p>
        </Card>
      )}
    </div>
  );
}
