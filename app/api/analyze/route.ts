import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { title, description } = await request.json();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze this stock market news and determine if it has a positive, negative, or neutral impact on the market. Provide a brief explanation.

News Title: ${title}
Description: ${description}

Please format your response as follows:
MARKET IMPACT: [POSITIVE/NEGATIVE/NEUTRAL]
Explanation: [2-3 sentences explaining why]`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);
      return NextResponse.json(
        { error: errorData.error?.message || "Failed to analyze news" },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return NextResponse.json(
        { error: "Invalid response format from API" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      analysis: data.candidates[0].content.parts[0].text,
    });
  } catch (error) {
    console.error("Error analyzing news:", error);
    return NextResponse.json(
      { error: "Failed to analyze news" },
      { status: 500 }
    );
  }
}
