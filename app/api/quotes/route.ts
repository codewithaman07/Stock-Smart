import yahooFinance from 'yahoo-finance2';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbols = searchParams.get('symbols');

  if (!symbols) {
    console.log('Missing symbols parameter');
    return NextResponse.json({ error: 'Symbols parameter is required' }, { status: 400 });
  }

  try {
    const symbolsArray = symbols.split(',').filter(Boolean); // Remove empty strings
    
    if (symbolsArray.length === 0) {
      console.log('No valid symbols provided');
      return NextResponse.json({ error: 'No valid symbols provided' }, { status: 400 });
    }

    console.log('Fetching quotes for symbols:', symbolsArray);
    
    const quotes = await Promise.all(
      symbolsArray.map(async symbol => {
        try {
          return await yahooFinance.quote(symbol.trim());
        } catch (err) {
          console.error(`Error fetching quote for ${symbol}:`, err);
          return null;
        }
      })
    );

    const validQuotes = quotes.filter(quote => quote !== null);
    
    if (validQuotes.length === 0) {
      console.log('No valid quotes retrieved');
      return NextResponse.json({ error: 'No valid quotes could be retrieved' }, { status: 404 });
    }

    const stockResults = validQuotes.map(quote => ({
      symbol: quote.symbol,
      shortName: quote.shortName || quote.longName || quote.symbol,
      regularMarketPrice: quote.regularMarketPrice,
      regularMarketChange: quote.regularMarketChange,
      regularMarketChangePercent: quote.regularMarketChangePercent,
      currency: quote.currency
    }));

    console.log('Successfully retrieved quotes:', stockResults.map(s => s.symbol));
    return NextResponse.json(stockResults);
  } catch (error) {
    console.error('Quotes API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch stock data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 