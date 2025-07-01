'use client';

import { useState, useEffect, useCallback } from 'react';
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

// More robust localStorage operations with error handling
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return null;
    }
  },
  
  setItem: (key: string, value: string): boolean => {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('Failed to write to localStorage:', error);
      return false;
    }
  },
  
  removeItem: (key: string): boolean => {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
      return false;
    }
  }
};

// Improved hook with better error handling and debugging
function usePersistentWatchlist() {
  const [watchlist, setWatchlistState] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const loadWatchlist = () => {
      const saved = safeLocalStorage.getItem('watchlist');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setWatchlistState(parsed);
            console.log('Loaded watchlist:', parsed);
          }
        } catch (error) {
          console.error('Error parsing saved watchlist:', error);
          // Reset corrupted data
          safeLocalStorage.removeItem('watchlist');
        }
      }
      setIsLoaded(true);
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(loadWatchlist, 100);
    return () => clearTimeout(timer);
  }, []);

  // Custom setter that also saves to localStorage
  const setWatchlist = useCallback((newWatchlist: string[] | ((prev: string[]) => string[])) => {
    setWatchlistState(prev => {
      const updated = typeof newWatchlist === 'function' ? newWatchlist(prev) : newWatchlist;
      
      // Save to localStorage immediately
      const success = safeLocalStorage.setItem('watchlist', JSON.stringify(updated));
      if (success) {
        console.log('Saved watchlist to localStorage:', updated);
      } else {
        console.error('Failed to save watchlist to localStorage');
      }
      
      return updated;
    });
  }, []);

  // Verify localStorage on focus (when user returns to tab)
  useEffect(() => {
    const handleFocus = () => {
      const saved = safeLocalStorage.getItem('watchlist');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setWatchlistState(parsed);
          }
        } catch (error) {
          console.error('Error reloading watchlist on focus:', error);
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  return [watchlist, setWatchlist, isLoaded] as const;
}

export default function WatchlistPage() {
  const [watchlist, setWatchlist, isLoaded] = usePersistentWatchlist();
  const [stocks, setStocks] = useState<WatchlistStock[]>([]);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<WatchlistStock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Add debugging
  useEffect(() => {
    console.log('Watchlist updated:', watchlist);
  }, [watchlist]);

  // Only fetch data after localStorage is loaded
  useEffect(() => {
    if (!isLoaded) return;

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
        setError('');
      } catch (err) {
        console.error('Error fetching watchlist:', err);
        setError(err instanceof Error ? err.message : 'Failed to update watchlist data');
      }
    };

    fetchWatchlistData();
    const interval = setInterval(fetchWatchlistData, 60000);
    return () => clearInterval(interval);
  }, [watchlist, isLoaded]);

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
      setWatchlist(prev => [...prev, symbol]);
      setSearchResults([]);
      setQuery('');
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.filter(s => s !== symbol));
  };

  // Show loading state while localStorage is being loaded
  if (!isLoaded) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading watchlist...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">My Watchlist</h1>
      
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
        <Input
          type="text"
          placeholder="Search stocks to add..."
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && searchStocks()}
          className="flex-1"
        />
        <Button onClick={searchStocks} disabled={loading} className="w-full sm:w-auto">
          <Search className="h-4 w-4 mr-2" />
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Search Results</h2>
          <div className="space-y-3 sm:space-y-4">
            {searchResults.map((stock) => (
              <Card key={stock.symbol} className="hover:shadow-md transition-shadow w-full">
                <Link href={`/stock/${stock.symbol}`}>
                  <CardHeader className="pb-2 sm:pb-6">
                    <CardTitle className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-base sm:text-lg truncate">{stock.symbol}</div>
                        <div className="text-sm text-muted-foreground line-clamp-2">{stock.shortName}</div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
                        <div className="text-xl sm:text-2xl font-semibold whitespace-nowrap">
                          {stock.regularMarketPrice.toFixed(2)} {stock.currency}
                        </div>
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            addToWatchlist(stock.symbol);
                          }}
                          disabled={watchlist.includes(stock.symbol)}
                          className="w-full sm:w-auto shrink-0"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {watchlist.includes(stock.symbol) ? 'Added' : 'Add'}
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
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Watchlist Stocks</h2>
        {stocks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Your watchlist is empty.</p>
            <p className="text-sm text-gray-400">Search for stocks to add them to your watchlist.</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {stocks.map((stock) => (
              <Card key={stock.symbol} className="hover:shadow-md transition-shadow w-full">
                <Link href={`/stock/${stock.symbol}`}>
                  <CardHeader className="pb-2 sm:pb-4">
                    <CardTitle className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-base sm:text-lg truncate">{stock.symbol}</div>
                        <div className="text-sm text-muted-foreground line-clamp-2">{stock.shortName}</div>
                      </div>
                      <div className="text-xl sm:text-2xl font-semibold shrink-0 whitespace-nowrap">
                        {stock.regularMarketPrice.toFixed(2)} {stock.currency}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <div className={`text-base sm:text-lg font-medium flex-1 min-w-0 ${stock.regularMarketChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <span className="whitespace-nowrap block sm:inline">
                          {stock.regularMarketChange >= 0 ? '+' : ''}
                          {stock.regularMarketChange.toFixed(2)} {stock.currency}
                        </span>
                        <span className="whitespace-nowrap block sm:inline sm:ml-1">
                          ({stock.regularMarketChangePercent.toFixed(2)}%)
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          removeFromWatchlist(stock.symbol);
                        }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto justify-center sm:justify-start shrink-0"
                      >
                        <Trash2 className="h-4 w-4 sm:mr-2" />
                        <span className="sm:inline hidden">Remove</span>
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