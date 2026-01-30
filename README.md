# Crypto Vibe Dashboard

AI-powered Chrome extension showing real-time crypto market sentiment for Herond Browser users.

## Features

### Core Features
- 🎯 **Market Mood Indicator** - Real-time bullish/bearish/neutral gauge based on live crypto prices
- 🤖 **AI Market Summary** - Google Gemini-powered market analysis with streaming text effect
- 📊 **Live Coin Tracker** - Real-time prices from CoinGecko with auto-refresh every 30 seconds
- ⚡ **Price Flash Animation** - Visual feedback when prices change (green up, red down)
- 📈 **Sparkline Charts** - 7-day price trends for each tracked coin
- 📰 **News Feed** - Latest crypto headlines with sentiment analysis
- ⚙️ **Coin Selector** - Customize up to 5 coins to track
- 💾 **Offline Support** - Chrome Storage caching for offline fallback

### 🎨 Creative Features (NEW!)
- 🎭 **Dynamic Mascot Reactions** - Animated emoji character that reacts to market sentiment:
  - 🤑 Extreme Bullish (>5%): Money eyes, bouncing animation
  - 😎 Bullish (>2%): Cool vibes, pulsing
  - 😐 Neutral (-2% to 2%): Chill state
  - 😰 Bearish (<-2%): Nervous, shaking
  - 😱 Extreme Bearish (<-5%): Panic mode, intense animation
- 💬 **AI Degen Mode Toggle** - Switch between:
  - 🤓 **Professional Mode**: Standard market analysis
  - 🚀 **Degen Mode**: Crypto slang commentary with WAGMI, NGMI, diamond hands, paper hands, moon, lambo, and more!
- 🎊 **Confetti Celebration** - Automatic confetti when ALL coins are green! Golden confetti when all coins are >10%
  - Demo trigger: Press `Ctrl+C` to test
  - Only triggers once per session
- 🔥 **Daily Streak Counter** - Track consecutive days opening the extension
  - Fire emoji intensity grows with your streak
  - Resets if you miss 24 hours
- 🌈 **Mood-Based Theme Colors** - Subtle background glow that changes with market sentiment:
  - Green glow for bullish markets
  - Red glow for bearish markets
  - Neutral dark theme for sideways action
- 🎰 **Prediction Mini-Game** - Test your market intuition!
  - Predict BTC's next hour trend (Up/Down/Sideways)
  - Track your accuracy percentage
  - See if you're a crypto oracle or need more practice!

## Tech Stack

- **Frontend:** React 19 + TypeScript
- **Styling:** Tailwind CSS 4
- **Charts:** Recharts + Custom Sparklines
- **Build Tool:** Vite
- **APIs:** CoinGecko, Google Gemini, Firecrawl
- **Storage:** Chrome Storage API

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Chrome/Chromium-based browser
- (Optional) Google Gemini API key for AI analysis
- (Optional) Firecrawl API key for news scraping

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nielwyn/crypto-vibe-dashboard.git
   cd crypto-vibe-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (Optional)
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_FIRECRAWL_API_KEY=your_firecrawl_api_key_here
   ```
   
   **Note:** The extension works without API keys using mock data for demo purposes.

4. **Build the extension**
   ```bash
   npm run build
   ```
   
   This creates a `dist/` folder with the compiled extension.

### Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select the `dist/` folder from the project directory
5. The Crypto Vibe Dashboard icon should appear in your extensions toolbar

### Development Mode

For development with hot reload:

```bash
npm run dev
```

Then load the extension from the `dist/` folder as described above. The extension will auto-reload when you make changes.

## API Setup Guides

### Google Gemini API

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **Get API Key**
4. Create a new API key
5. Copy the key and add it to your `.env` file

### Firecrawl API

1. Visit [Firecrawl](https://www.firecrawl.dev/)
2. Sign up for an account
3. Navigate to your dashboard
4. Copy your API key
5. Add it to your `.env` file

**Note:** Without API keys, the extension uses mock/fallback data which is suitable for testing and demonstration.

## Usage

1. Click the extension icon in your browser toolbar
2. The popup displays:
   - **Animated Mascot** (top-right) reacting to market mood
   - Market mood gauge (bullish/bearish/neutral)
   - AI-generated market analysis with Pro/Degen mode toggle
   - Live prices for your selected coins
   - 7-day price trend sparklines
   - Latest crypto news headlines
   - **Daily Streak Counter** (bottom) showing consecutive days
   - **Prediction Game** button to test your market intuition
3. Click the gear icon to customize which coins to track (max 5)
4. Toggle between **Professional** and **Degen** mode for AI analysis
5. Watch for **Confetti** when all your coins are green! 🎊
6. Prices auto-refresh every 30 seconds
7. News updates every 5 minutes

### Easter Eggs & Tips
- Press `Ctrl+C` to trigger confetti manually (great for demos!)
- Your daily streak resets if you miss 24 hours - keep coming back!
- Try Degen mode for entertaining crypto slang analysis
- The mascot gets more dramatic as market sentiment intensifies
- Background subtly glows green (bullish) or red (bearish)

## Project Structure

```
crypto-vibe-dashboard/
├── manifest.json              # Chrome extension manifest (V3)
├── public/
│   ├── manifest.json         # Extension configuration
│   └── icons/                # Extension icons
├── src/
│   ├── popup/                # Popup UI
│   │   ├── index.html       # HTML entry point
│   │   ├── index.css        # Global styles with custom animations
│   │   ├── index.tsx        # React entry point
│   │   ├── App.tsx          # Main app component
│   │   └── components/      # React components
│   │       ├── AISummary.tsx          # AI analysis with mode toggle
│   │       ├── CoinCard.tsx           # Individual coin display
│   │       ├── CoinSelector.tsx       # Coin selection UI
│   │       ├── MoodGauge.tsx          # Market sentiment indicator
│   │       ├── NewsTicker.tsx         # News carousel
│   │       ├── RefreshIndicator.tsx   # Last update timestamp
│   │       ├── Sparkline.tsx          # Mini price chart
│   │       ├── Mascot.tsx             # 🎭 Animated mascot (NEW)
│   │       ├── ModeToggle.tsx         # 💬 Pro/Degen toggle (NEW)
│   │       ├── Confetti.tsx           # 🎊 Celebration animation (NEW)
│   │       ├── StreakCounter.tsx      # 🔥 Daily streak tracker (NEW)
│   │       └── PredictionGame.tsx     # 🎰 Prediction mini-game (NEW)
│   ├── services/            # API services
│   │   ├── coingecko.ts    # CoinGecko API integration
│   │   ├── gemini.ts       # Google Gemini AI integration (with degen mode)
│   │   ├── firecrawl.ts    # Firecrawl news scraping
│   │   └── storage.ts      # Chrome Storage wrapper (with streak & predictions)
│   ├── hooks/               # Custom React hooks
│   │   ├── useCoins.ts     # Coin data management
│   │   ├── useAI.ts        # AI analysis management (mode support)
│   │   └── useNews.ts      # News data management
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts        # UserStats, Prediction, extended types
│   └── utils/               # Utility functions
│       └── sentiment.ts    # Market sentiment calculation
└── README.md
```

## Build Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production-ready extension
- `npm run preview` - Preview production build

## Features Breakdown

### Market Mood Indicator
- Calculates average 24h price change across selected coins
- Bullish: avg > 2%
- Bearish: avg < -2%
- Neutral: between -2% and 2%
- Animated gauge with smooth transitions

### AI Market Summary
- Powered by Google Gemini API
- Analyzes current price data
- Streaming text effect for better UX
- Manual refresh to save API calls
- Caches analysis in Chrome Storage

### Live Coin Tracker
- Real-time data from CoinGecko (no API key required)
- Auto-refresh every 30 seconds
- Flash animation on price updates
- 7-day sparkline charts
- Supports tracking up to 5 coins

### News Feed
- Latest crypto headlines
- Sentiment classification (positive/negative/neutral)
- Auto-refresh every 5 minutes
- Carousel view with navigation dots

## Troubleshooting

### Extension not loading
- Ensure you've run `npm run build`
- Check that you're loading the `dist/` folder, not the root folder
- Check browser console for errors

### No data showing
- Check your internet connection
- CoinGecko API may have rate limits (free tier)
- Try refreshing the extension
- Check browser console for API errors

### AI analysis not working
- Ensure `VITE_GEMINI_API_KEY` is set in `.env`
- Rebuild after adding API key (`npm run build`)
- Check that your Gemini API key is valid
- Mock data will be shown if API fails

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- [CoinGecko](https://www.coingecko.com/) for crypto market data
- [Google Gemini](https://ai.google.dev/) for AI analysis
- [Firecrawl](https://www.firecrawl.dev/) for news scraping
- Built for Herond Browser users