# Component Architecture

## Visual Component Hierarchy

```
App.tsx
├── Header
│   ├── Title: "Crypto Vibe Dashboard"
│   └── RefreshIndicator (pulsing dot + countdown)
│
├── MoodGauge
│   ├── Market Mood Label (BULLISH/BEARISH/NEUTRAL)
│   ├── Score Display (percentage)
│   └── Animated Gauge (circular with icon)
│
├── AISummary
│   ├── Header with "Refresh" button
│   ├── Streaming text display (typewriter effect)
│   └── Timestamp
│
├── CoinSelector
│   ├── Button showing coin count
│   └── Modal with coin list (max 5 selections)
│
├── CoinCard[] (for each selected coin)
│   ├── Coin Symbol & Name (BTC, ETH, etc.)
│   ├── Current Price (formatted)
│   ├── 24h Change Badge (green ▲ / red ▼)
│   └── Sparkline Chart (7-day trend)
│
└── NewsTicker
    ├── Header with counter (1/5)
    ├── News Carousel (auto-rotating)
    │   ├── Sentiment Badge (🟢/🔴/⚪)
    │   ├── Headline (clickable)
    │   └── Source & Sentiment Label
    └── Navigation Dots
```

## Component Details

### MoodGauge
**Purpose**: Display overall market sentiment  
**Input**: MarketSentiment object  
**Features**:
- Calculates from average 24h change of all coins
- Animated circular gauge
- Color changes based on sentiment
- Emoji indicator

### AISummary
**Purpose**: Show AI-generated market analysis  
**API**: Google Gemini  
**Features**:
- Streaming text effect (typewriter)
- Manual refresh button
- Loading skeletons
- Cached results

### CoinCard
**Purpose**: Display individual coin data  
**API**: CoinGecko  
**Features**:
- Real-time price
- Flash animation on price change
- 7-day sparkline chart
- 24h percentage change

### CoinSelector
**Purpose**: Customize tracked coins  
**Storage**: Chrome Storage API  
**Features**:
- Modal overlay
- Max 5 coin limit
- Prevents removing last coin
- Selections persist

### NewsTicker
**Purpose**: Display crypto news headlines  
**API**: Firecrawl (with fallback)  
**Features**:
- Auto-rotating carousel
- Sentiment color coding
- Click-through to source
- Manual navigation

### RefreshIndicator
**Purpose**: Show refresh status  
**Features**:
- Pulsing green dot animation
- Countdown timer (30s)
- Visual feedback

### Sparkline
**Purpose**: Mini price trend chart  
**Input**: Array of prices  
**Features**:
- SVG-based rendering
- Color matches price direction
- Compact visualization

## Data Flow

```
User Opens Extension
        ↓
    App.tsx loads
        ↓
    useCoins() hook
        ├→ storage.getPreferences() → Get selected coins
        ├→ coingecko.getCoins() → Fetch prices
        └→ storage.setCoinCache() → Cache results
        ↓
    useNews() hook
        ├→ firecrawl.getNews() → Fetch headlines
        └→ storage.setNewsCache() → Cache results
        ↓
    useAI() hook (manual trigger)
        ├→ storage.getAICache() → Load cached analysis
        └→ gemini.generateAnalysis() → New analysis
        ↓
    Components render with data
        ↓
    Auto-refresh timers
        ├→ Coins: every 30s
        └→ News: every 5min
```

## Storage Schema

### Chrome Storage Local
```typescript
{
  userPreferences: {
    selectedCoins: ['bitcoin', 'ethereum', 'solana'],
    refreshInterval: 30
  },
  coinCache: CoinData[],
  aiCache: AIAnalysis,
  newsCache: NewsItem[]
}
```

## API Integrations

### CoinGecko (No Key Required)
- **Endpoint**: `/api/v3/coins/markets`
- **Rate Limit**: ~10-50 calls/minute (free tier)
- **Data**: prices, 24h changes, sparklines

### Google Gemini (Requires Key)
- **Model**: gemini-pro
- **Usage**: AI market analysis
- **Fallback**: Mock analysis generated locally

### Firecrawl (Requires Key)
- **Usage**: News scraping
- **Fallback**: Mock news headlines

## Styling System

### Tailwind Configuration
```javascript
colors: {
  'crypto-dark': '#0f0f0f',      // Background
  'crypto-accent-green': '#00ff88', // Bullish/Positive
  'crypto-accent-red': '#ff3366',   // Bearish/Negative
}
```

### UI Patterns
- **Cards**: `bg-gray-900 rounded-lg p-4`
- **Animations**: Tailwind transitions + custom keyframes
- **Typography**: Sans-serif system fonts
- **Spacing**: Consistent 4px grid

## Performance Optimizations

1. **Chrome Storage Caching**: All API responses cached
2. **Debounced Refreshes**: Prevents excessive API calls
3. **Lazy Loading**: Components render progressively
4. **Optimized Builds**: Vite bundle optimization
5. **Sparklines**: Lightweight SVG (not canvas)

## Extension Manifest V3 Features

- **Permissions**: storage, alarms
- **Host Permissions**: CoinGecko, Google AI APIs
- **Content Security Policy**: Default (restrictive)
- **Action**: Popup-only (no background service worker needed)
