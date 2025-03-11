'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface StockDetails {
  symbol: string;
  shortName: string;
  longName: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  currency: string;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketVolume: number;
  marketCap: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  averageVolume: number;
  trailingPE?: number;
  dividendYield?: number;
}

interface ChartData {
  date: string;
  price: number;
  volume: number;
}

export default function StockPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  const [stock, setStock] = useState<StockDetails | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('1y');
  const [error, setError] = useState('');
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const periods = [
    { label: '1D', value: '1d' },
    { label: '5D', value: '5d' },
    { label: '1M', value: '1m' },
    { label: '6M', value: '6m' },
    { label: '1Y', value: '1y' },
    { label: '5Y', value: '5y' },
  ];

  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        const response = await fetch(`/api/stock/${encodeURIComponent(symbol)}`);
        if (!response.ok) throw new Error('Failed to fetch stock details');
        const data = await response.json();
        setStock(data);
      } catch (err) {
        setError('Failed to load stock details');
        console.error(err);
      }
    };

    const fetchChartData = async () => {
      try {
        const response = await fetch(`/api/stock/${encodeURIComponent(symbol)}/history?period=${selectedPeriod}`);
        if (!response.ok) throw new Error('Failed to fetch chart data');
        const data = await response.json();
        setChartData(data);
      } catch (err) {
        console.error('Failed to load chart data:', err);
      }
    };

    // Check if stock is in watchlist
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    setIsInWatchlist(watchlist.includes(symbol));

    fetchStockDetails();
    fetchChartData();
  }, [symbol, selectedPeriod]);

  const toggleWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    let newWatchlist;
    
    if (isInWatchlist) {
      newWatchlist = watchlist.filter((s: string) => s !== symbol);
    } else {
      newWatchlist = [...watchlist, symbol];
    }
    
    localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
    setIsInWatchlist(!isInWatchlist);
  };

  if (error) {
    return <div className="text-red-500 p-6">{error}</div>;
  }

  if (!stock) {
    return <div className="p-6">Loading...</div>;
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: stock.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `${(marketCap / 1e6).toFixed(2)}M`;
    }
    return formatNumber(marketCap);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{stock.longName || stock.shortName}</h1>
          <p className="text-gray-600 text-lg">{stock.symbol}</p>
        </div>
        <Button
          variant="outline"
          onClick={toggleWatchlist}
          className={isInWatchlist ? "text-blue-600" : ""}
        >
          {isInWatchlist ? (
            <>
              <BookmarkCheck className="h-4 w-4 mr-2" />
              In Watchlist
            </>
          ) : (
            <>
              <Bookmark className="h-4 w-4 mr-2" />
              Add to Watchlist
            </>
          )}
        </Button>
      </div>

      {/* Price Chart */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Price History</CardTitle>
            <div className="flex gap-2">
              {periods.map(period => (
                <Button
                  key={period.value}
                  variant={selectedPeriod === period.value ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period.value)}
                >
                  {period.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date"
                  tickFormatter={(date) => {
                    const d = new Date(date);
                    return selectedPeriod === '1d' || selectedPeriod === '5d'
                      ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : d.toLocaleDateString();
                  }}
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'Price']}
                  labelFormatter={(label) => new Date(label).toLocaleString()}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#2563eb"
                  fill="#3b82f6"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {formatCurrency(stock.regularMarketPrice)}
            </div>
            <div className={`text-lg ${stock.regularMarketChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stock.regularMarketChange >= 0 ? '+' : ''}
              {formatCurrency(stock.regularMarketChange)} ({stock.regularMarketChangePercent.toFixed(2)}%)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trading Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Day Range</p>
                <p>{formatCurrency(stock.regularMarketDayLow)} - {formatCurrency(stock.regularMarketDayHigh)}</p>
              </div>
              <div>
                <p className="text-gray-600">Volume</p>
                <p>{formatNumber(stock.regularMarketVolume)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Market Cap</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatMarketCap(stock.marketCap)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>52 Week Range</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{formatCurrency(stock.fiftyTwoWeekLow)} - {formatCurrency(stock.fiftyTwoWeekHigh)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stock.trailingPE && (
                <div>
                  <p className="text-gray-600">P/E Ratio</p>
                  <p>{stock.trailingPE.toFixed(2)}</p>
                </div>
              )}
              {stock.dividendYield && (
                <div>
                  <p className="text-gray-600">Dividend Yield</p>
                  <p>{(stock.dividendYield * 100).toFixed(2)}%</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 