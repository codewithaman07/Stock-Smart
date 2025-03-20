'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { ArrowLeft, Brain, ArrowRight } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

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

interface Analysis {
  impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  explanation: string;
}

export default function NewsAnalysisPage() {
  const router = useRouter();
  const params = useParams();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticleAndAnalysis = async () => {
      try {
        // Get the article from localStorage
        const newsData = localStorage.getItem('newsData');
        if (!newsData) {
          throw new Error('No news data found');
        }
        const articles = JSON.parse(newsData);
        const articleId = typeof params.id === 'string' ? parseInt(params.id) : parseInt(params.id[0]);
        const article = articles[articleId];
        if (!article) {
          throw new Error('Article not found');
        }
        setArticle(article);

        // Get analysis
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: `Analyze this stock market news and determine if it has a positive, negative, or neutral impact on the market. Provide a brief explanation.

News Title: ${article.title}
Description: ${article.description}

Please format your response as follows:
MARKET IMPACT: [POSITIVE/NEGATIVE/NEUTRAL]
Explanation: [2-3 sentences explaining why]`
          }),
        });

        if (!response.ok) throw new Error('Failed to analyze article');
        const data = await response.json();
        const analysisText = data.candidates[0].content.parts[0].text;
        
        // Parse the analysis text
        const impactMatch = analysisText.match(/MARKET IMPACT:\s*(POSITIVE|NEGATIVE|NEUTRAL)/i);
        const explanationMatch = analysisText.match(/Explanation:\s*(.*?)(?=\n|$)/s);
        
        setAnalysis({
          impact: (impactMatch?.[1] || 'NEUTRAL') as 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL',
          explanation: explanationMatch?.[1]?.trim() || 'No explanation available.'
        });
      } catch (err) {
        setError('Failed to load article analysis');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchArticleAndAnalysis();
    }
  }, [params.id]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'POSITIVE':
        return 'bg-green-100 text-green-800';
      case 'NEGATIVE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
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

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">Loading analysis...</div>
      </div>
    );
  }

  if (error || !article || !analysis) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-red-500 text-center py-8">{error || 'Article not found'}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to News
      </Button>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="space-y-4">
              <CardTitle className="text-2xl">{article.title}</CardTitle>
              <a 
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button 
                  variant="outline" 
                  className="text-black-600 hover:text-black-700 hover:scale-102 cursor-pointer border-black-600 rounded-2xl"
                >
                  Read Full Article
                </Button>
              </a>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-[300px_1fr] gap-6">
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              <div>
                <p className="text-gray-600 mb-4">{article.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{article.source.name}</span>
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6" />
              <CardTitle>AI Analysis</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className={`inline-block px-4 py-2 rounded-full ${getImpactColor(analysis.impact)}`}>
                <span className="font-semibold">Market Impact: {analysis.impact}</span>
              </div>
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-2">Explanation</h3>
                <p className="text-gray-600">{analysis.explanation}</p>
              </div>
              <div className="mt-6 pt-4 border-t">
                <a 
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-2"
                >
                  Continue reading the full article
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 