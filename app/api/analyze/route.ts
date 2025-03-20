import { NextResponse } from "next/server";

const GEMINI_API_KEY = 'AIzaSyCNqx0XFlcK22bs6QXttLcdKKhooz6ZxqA';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze text');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze text' },
      { status: 500 }
    );
  }
}
