'use client';

import { useState, useEffect } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Search, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface WatchlistStock {
  symbol: string;
  shortName: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  currency: string;
}

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [stocks, setStocks] = useState<WatchlistStock[]>([]);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<WatchlistStock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('watchlist');
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Fetch latest data for watchlist stocks
  useEffect(() => {
    const fetchWatchlistData = async () => {
      if (watchlist.length === 0) {
        setStocks([]);
        return;
      }

      try {
        const symbols = watchlist.join(',');
        console.log('Fetching watchlist data for symbols:', symbols);
        
        const response = await fetch(`/api/quotes?symbols=${encodeURIComponent(symbols)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch watchlist data');
        }

        if (data.error) {
          throw new Error(data.error);
        }

        setStocks(data);
        setError(''); // Clear any existing errors on successful fetch
      } catch (err) {
        console.error('Error fetching watchlist:', err);
        setError(err instanceof Error ? err.message : 'Failed to update watchlist data');
        // Don't clear existing stocks on error - keep showing old data
      }
    };

    fetchWatchlistData();
    // Refresh every minute
    const interval = setInterval(fetchWatchlistData, 60000);
    return () => clearInterval(interval);
  }, [watchlist]);

  const searchStocks = async () => {
    if (!query) return;

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setSearchResults(data);
    } catch (err) {
      setError('Failed to fetch stock data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol]);
      setSearchResults([]);
      setQuery('');
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter(s => s !== symbol));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Watchlist</h1>
      
      <div className="flex gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search stocks to add..."
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

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <div className="grid gap-4">
            {searchResults.map((stock) => (
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
                </Link>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Watchlist */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Watchlist Stocks</h2>
        {stocks.length === 0 ? (
          <p className="text-gray-500">Your watchlist is empty. Search for stocks to add them.</p>
        ) : (
          <div className="grid gap-4">
            {stocks.map((stock) => (
              <Card key={stock.symbol} className="hover:shadow-md transition-shadow">
                <Link href={`/stock/${stock.symbol}`}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{stock.symbol} - {stock.shortName}</span>
                      <span className="text-2xl">{stock.regularMarketPrice.toFixed(2)} {stock.currency}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className={`text-lg ${stock.regularMarketChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.regularMarketChange >= 0 ? '+' : ''}
                        {stock.regularMarketChange.toFixed(2)} {stock.currency} ({stock.regularMarketChangePercent.toFixed(2)}%)
                      </div>
                      <Button 
                        variant="ghost" 
                        onClick={(e) => {
                          e.preventDefault();
                          removeFromWatchlist(stock.symbol);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 