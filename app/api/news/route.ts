import { NextResponse } from 'next/server';

const API_KEY = 'cc830b940cd8459697b3235e557392e4';
const BASE_URL = 'https://newsapi.org/v2';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || 'stock market';
  const page = searchParams.get('page') || '1';

  // Improve search relevance by adding specific parameters
  const searchQuery = query === 'stock market' 
    ? 'stock market OR financial markets OR wall street'
    : `${query} stock OR ${query} shares OR ${query} company OR ${query} market`;

  try {
    const response = await fetch(
      `${BASE_URL}/everything?` + 
      `q=${encodeURIComponent(searchQuery)}&` +
      `page=${page}&` +
      `pageSize=10&` +
      `sortBy=relevancy&` + // Changed from publishedAt to relevancy
      `language=en&` +
      `apiKey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
} 