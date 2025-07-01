import yahooFinance from 'yahoo-finance2';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  const symbol = params.symbol;
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '1y';

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    const queryOptions = {
      period2: new Date(),
      period1: new Date(Date.now() - getPeriodInMs(period)),
      interval: getInterval(period),
    };

    const result = await yahooFinance.historical(symbol, queryOptions);
    
    // Format the data for the chart
    const chartData = result.map(item => ({
      date: item.date.toISOString().split('T')[0],
      price: item.close,
      volume: item.volume,
    }));

    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Historical data error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch historical data' },
      { status: 500 }
    );
  }
}

function getPeriodInMs(period: string): number {
  const day = 24 * 60 * 60 * 1000;
  switch (period) {
    case '1d': return day;
    case '5d': return 5 * day;
    case '1m': return 30 * day;
    case '6m': return 180 * day;
    case '1y': return 365 * day;
    case '5y': return 5 * 365 * day;
    default: return 365 * day; 
  }
}

function getInterval(period: string): "1d" | "1wk" | "1mo" {
  switch (period) {
    case '1d':
    case '5d':
    case '1m':
    case '6m':
    case '1y':
      return '1d';
    case '5y':
      return '1wk';
    default:
      return '1d';
  }
}