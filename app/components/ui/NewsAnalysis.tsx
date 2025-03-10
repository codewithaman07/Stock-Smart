'use client';

import { useState } from 'react';
import { Button } from './button';
import { analyzeNewsWithGemini } from '../../../lib/gemini';
import { Loader2, RefreshCw, ExternalLink } from 'lucide-react';

interface NewsAnalysisProps {
  title: string;
  description: string;
  url: string;
}

export function NewsAnalysis({ title, description, url }: NewsAnalysisProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullContent, setFullContent] = useState<string | null>(null);

  const fetchFullContent = async () => {
    try {
      const response = await fetch(`/api/fetch-content?url=${encodeURIComponent(url)}`);
      if (!response.ok) throw new Error('Failed to fetch content');
      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error('Error fetching content:', error);
      return null;
    }
  };

  const analyzeNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const content = await fetchFullContent();
      setFullContent(content);

      const result = await analyzeNewsWithGemini(
        title,
        content || description
      );
      setAnalysis(result);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze news');
    } finally {
      setLoading(false);
    }
  };

  const renderAnalysis = () => {
    if (!analysis) return null;

    const lines = analysis.split('\n');
    const impactLine = lines.find(line => line.startsWith('MARKET IMPACT:'));
    const explanationLine = lines.find(line => line.startsWith('Explanation:'));

    const impact = impactLine?.toLowerCase() || '';
    let impactColor = 'text-gray-600';
    
    if (impact.includes('positive')) {
      impactColor = 'text-green-600';
    } else if (impact.includes('negative')) {
      impactColor = 'text-red-600';
    }

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm">
        <div className="font-semibold mb-2">
          <span className={impactColor}>{impactLine}</span>
        </div>
        <div className="text-gray-700">{explanationLine}</div>
        {fullContent && (
          <div className="mt-2 text-xs text-gray-500">
            Analysis of the full article
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          Analyzing news...
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <ExternalLink className="h-3 w-3" />
          Read full article
        </a>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-sm text-red-500">
          {error}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={analyzeNews}
          className="text-sm flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Retry Analysis
        </Button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <ExternalLink className="h-3 w-3" />
          Read full article
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {!analysis ? (
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={analyzeNews}
            className="text-sm"
          >
            Analyze Impact
          </Button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <ExternalLink className="h-3 w-3" />
            Read full article
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {renderAnalysis()}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setAnalysis(null);
                setError(null);
                setFullContent(null);
              }}
            >
              Analyze Again
            </Button>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              Read full article
            </a>
          </div>
        </div>
      )}
    </div>
  );
} 