import { NextResponse } from 'next/server';

interface NewsArticle {
  title: string | null;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

const API_KEY = process.env.NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

export async function GET(request: Request) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: 'NEWS_API_KEY is not configured' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || 'stock market';
  const page = searchParams.get('page') || '1';

  // Get date range for the last 7 days to ensure fresh news
  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 7);

  // Improve search relevance by adding specific parameters
  const searchQuery = query === 'stock market' 
    ? 'stock market OR financial markets OR wall street OR NYSE OR NASDAQ OR S&P 500 OR trading OR stocks'
    : `${query} stock OR ${query} shares OR ${query} company OR ${query} market OR ${query} trading OR ${query} earnings`;

  try {
    const response = await fetch(
      `${BASE_URL}/everything?` + 
      `q=${encodeURIComponent(searchQuery)}&` +
      `from=${fromDate.toISOString().split('T')[0]}&` +
      `to=${toDate.toISOString().split('T')[0]}&` +
      `page=${page}&` +
      `pageSize=20&` +
      `sortBy=publishedAt&` +
      `language=en&` +
      `domains=reuters.com,bloomberg.com,cnbc.com,marketwatch.com,yahoo.com,wsj.com,forbes.com,fortune.com,cnn.com,bbc.com&` +
      `apiKey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    const data: NewsApiResponse = await response.json();
    
    // Filter out articles without images or with poor quality content
    if (data.articles) {
      data.articles = data.articles.filter((article: NewsArticle) => 
        article.title && 
        article.description && 
        article.urlToImage && 
        article.source.name &&
        !article.title.includes('[Removed]') &&
        !article.description.includes('[Removed]') &&
        article.description.length > 50
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
} 