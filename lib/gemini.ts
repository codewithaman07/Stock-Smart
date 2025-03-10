export async function analyzeNewsWithGemini(newsTitle: string, newsDescription: string) {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newsTitle,
        description: newsDescription,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze news');
    }

    const data = await response.json();
    return data.analysis;
  } catch (error) {
    console.error('Error analyzing news:', error);
    throw error;
  }
} 