'use client';

import { useEffect, useState } from 'react';
import { NewsAnalysis } from '../components/ui/NewsAnalysis';
import { Button } from '../components/ui/button';
import { Loader2 } from 'lucide-react';

interface NewsItem {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
  urlToImage?: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(10);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=stock+market&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}&language=en&sortBy=publishedAt&pageSize=20`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        
        if (data.status === 'error') {
          throw new Error(data.message || 'Failed to fetch news');
        }

        if (!Array.isArray(data.articles)) {
          throw new Error('Invalid news data format');
        }

        setNews(data.articles);
      } catch (error) {
        console.error('Error fetching news:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleShowMore = () => {
    setDisplayCount(prev => Math.min(prev + 10, news.length));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="text-red-500 text-xl">Error</div>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Stock Market News</h1>
        <p className="text-gray-600 mt-2">Latest updates from the financial world</p>
      </div>

      <div className="grid gap-6">
        {news.slice(0, displayCount).map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex gap-4">
              {item.urlToImage && (
                <img 
                  src={item.urlToImage} 
                  alt={item.title}
                  className="w-32 h-32 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{item.source.name}</span>
                  <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                </div>
                <div className="mt-4 flex items-start gap-4">
                  <div className="flex-1">
                    <NewsAnalysis 
                      title={item.title} 
                      description={item.description} 
                      url={item.url}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {displayCount < news.length && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={handleShowMore}
            className="flex items-center gap-2"
          >
            Show More News
            <Loader2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
} 