'use client';

import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
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
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Stock Market News</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with the latest market developments and insights
          </p>
        </div>
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search news..."
              value={query}
              onChange={handleQueryChange}
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={loading}>
            Search
          </Button>
        </form>
      </div>

      {error && (
        <Card className="p-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </Card>
      )}

      {loading ? (
        <div className="grid gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <div className="md:flex">
                <div className="md:w-1/3 bg-muted h-48 md:h-auto"></div>
                <div className="p-6 md:w-2/3 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="space-y-2 mt-4">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {news.slice((page - 1) * 10, page * 10).map((article, index) => (
              <Card key={index} className="overflow-hidden hover-lift group">
                <div className="md:flex">
                  {article.urlToImage && (
                    <div className="md:w-1/3 relative overflow-hidden">
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  )}
                  <div className="p-6 md:w-2/3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium text-muted-foreground">
                          {article.source.name}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {formatDate(article.publishedAt)}
                        </div>
                      </div>
                      <h2 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h2>
                      {article.description && (
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {article.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Read Full Article →
                      </a>
                      <Button
                        onClick={() => handleAnalyze(index + (page - 1) * 10)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Brain className="w-4 h-4" />
                        AI Analysis
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1 || loading}
                size="sm"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <Button
                      key={pageNumber}
                      variant={page === pageNumber ? "default" : "outline"}
                      onClick={() => setPage(pageNumber)}
                      disabled={loading}
                      size="sm"
                      className="w-8 h-8 p-0"
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages || loading}
                size="sm"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}