'use client';

import { useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Search, Plus } from 'lucide-react';
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Search Stocks</h1>
      
      <div className="flex gap-4 mb-6">
        <Input
          type="text"
          placeholder="Enter stock symbol or company name..."
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && searchStocks()}
          className="flex-1"
        />
        <Button onClick={searchStocks} disabled={loading}>
          <Search className="h-4 w-4 mr-2" />
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      <div className="grid gap-4">
        {results.map((stock) => (
          <Card key={stock.symbol} className="hover:shadow-md transition-shadow">
            <Link href={`/stock/${stock.symbol}`}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{stock.symbol} - {stock.shortName}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{stock.regularMarketPrice.toFixed(2)} {stock.currency}</span>
                    <Button 
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        addToWatchlist(stock.symbol);
                      }}
                      disabled={watchlist.includes(stock.symbol)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {watchlist.includes(stock.symbol) ? 'Added' : 'Add to Watchlist'}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-lg ${stock.regularMarketChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stock.regularMarketChange >= 0 ? '+' : ''}
                  {stock.regularMarketChange.toFixed(2)} {stock.currency} ({stock.regularMarketChangePercent.toFixed(2)}%)
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
