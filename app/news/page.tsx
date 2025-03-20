'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search, ChevronLeft, ChevronRight, Brain, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface NewsResponse {
  articles: NewsArticle[];
  totalResults: number;
  status: string;
}

export default function NewsPage() {
  const router = useRouter();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const fetchNews = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/news?query=${encodeURIComponent(debouncedQuery || 'stock market')}&page=${page}`);
      if (!response.ok) throw new Error('Failed to fetch news');
      const data: NewsResponse = await response.json();
      
      // Sort articles by date (newest first)
      const sortedArticles = data.articles.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

      setNews(sortedArticles);
      setTotalPages(Math.ceil(sortedArticles.length / 10));
      localStorage.setItem('newsData', JSON.stringify(sortedArticles));
    } catch (err) {
      setError('Failed to load news');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch news when page or debounced query changes
  useEffect(() => {
    fetchNews();
  }, [page, debouncedQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(1);
  };

  const handleAnalyze = (index: number) => {
    router.push(`/news/analysis/${index}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Stock Market News</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-4 flex-1">
          <Input
            type="text"
            placeholder="Search news..."
            value={query}
            onChange={handleQueryChange}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </div>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading news...</div>
      ) : (
        <>
          <div className="grid gap-6">
            {news.map((article, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 transition-colors"
                      >
                        {article.title}
                      </a>
                    </CardTitle>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleAnalyze(index)}
                      className="bg-black hover:bg-gray-800 text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 cursor-pointer"
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Analyze
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-[200px_1fr] gap-4">
                    {article.urlToImage && (
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-48 object-cover rounded-md"
                      />
                    )}
                    <div>
                      <p className="text-gray-600 mb-2">{article.description}</p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{article.source.name}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(article.publishedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <span className="py-2 px-4">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 