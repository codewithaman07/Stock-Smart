# Stock Smart

A modern web application that provides real-time stock market news analysis using AI. Built with Next.js, Tailwind CSS, and Gemini AI.

## Features

- 📰 Real-time stock market news from various sources
- 🤖 AI-powered news analysis using Google's Gemini AI
- 🎨 Modern, responsive UI with ChatGPT-like sidebar
- 📊 Sentiment analysis (Positive/Negative/Neutral)
- 🔍 Full article content analysis
- 📱 Mobile-friendly design
- ⚡ Fast and efficient performance

## Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **AI Integration**: Google Gemini AI
- **News API**: NewsAPI.org
- **Content Parsing**: Cheerio
- **Icons**: Lucide Icons

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/stock-smart.git
cd stock-smart
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   - Get your API keys:
     - [News API Key](https://newsapi.org/register)
     - [Gemini AI Key](https://makersuite.google.com/app/apikey)
   - Update the `.env` file with your API keys

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

The following environment variables are required:

- `NEXT_PUBLIC_NEWS_API_KEY`: Your News API key (client-side)
- `GEMINI_API_KEY`: Your Google Gemini AI key (server-side only)
- `NODE_ENV`: Environment setting (development/production)

⚠️ **Important**: Never commit your `.env` file or expose your API keys. The `.env` file is already included in `.gitignore`.

## Features in Detail

### News Feed
- Real-time stock market news updates
- Top 10 latest news with "Show More" functionality
- News cards with images, titles, and descriptions
- Source attribution and publication dates

### AI Analysis
- Sentiment analysis of news articles
- Color-coded impact indicators:
  - 🟢 Positive Impact
  - 🔴 Negative Impact
  - ⚪ Neutral Impact
- Full article content analysis
- Brief explanation of market impact

### User Interface
- ChatGPT-like sidebar navigation
- Responsive design for all devices
- Clean and modern UI
- Easy-to-use analysis controls

## API Integration

### News API
- Fetches real-time stock market news
- Supports multiple news sources
- Includes images and full article content

### Gemini AI
- Analyzes news sentiment
- Provides market impact assessment
- Generates concise explanations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Google Gemini AI](https://ai.google.dev/)
- [NewsAPI](https://newsapi.org/)
- [Cheerio](https://cheerio.js.org/)
