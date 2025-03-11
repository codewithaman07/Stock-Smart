import yahooFinance from 'yahoo-finance2';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const searchResults = await yahooFinance.search(query);
    const quotes = await Promise.all(
      searchResults.quotes
        .slice(0, 5)
        .filter(quote => quote.quoteType === 'EQUITY')
        .map(quote => yahooFinance.quote(quote.symbol))
    );

    const stockResults = quotes.map(quote => ({
      symbol: quote.symbol,
      shortName: quote.shortName || quote.longName || quote.symbol,
      regularMarketPrice: quote.regularMarketPrice,
      regularMarketChange: quote.regularMarketChange,
      regularMarketChangePercent: quote.regularMarketChangePercent,
      currency: quote.currency
    }));

    return NextResponse.json(stockResults);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
  }
} 