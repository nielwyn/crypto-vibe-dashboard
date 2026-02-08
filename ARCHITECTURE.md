# Crypto Vibe Dashboard - Architecture

## PROJECT OVERVIEW
**Project Name:** Crypto Vibe Dashboard  
**One-Line Description:** AI-powered Chrome extension with 6 unique AI personas, real-time crypto sentiment, DeFi yields, action cards & survival mini-game for Herond Browser users  
**Target Users:** Crypto traders, Web3 enthusiasts, DeFi farmers, Herond Browser users  
**Problem It Solves:** Quick market mood check + personalized yield opportunities + fun engagement without opening multiple tabs/apps

---

## HACKATHON SCORING ALIGNMENT

| Criteria | Weight | How We Address It |
|----------|--------|-------------------|
| **COMPLETION** | 50% | ✅ Live demo with real APIs (CoinGecko, DefiLlama, Gemini, Alternative.me). Working extension with all core features + mini-game. |
| **FEASIBILITY** | 20% | ✅ Perfect for Herond roadmap: Web3 users need quick sentiment + yield data. Can be new tab page or sidebar widget. |
| **AI USAGE** | 15% | ✅ **6 AI Personas** (Analyst, Degen, Gambler, Zen, Anchor, Pirate). Context-aware analysis based on selected coins. Action cards with confidence scores. |
| **CREATIVITY** | 15% | ✅ Mascot reactions, confetti, prediction game, streak counter, **Crypto Survivor mini-game**, **3D card flip**, **AI personas**, **visible action cards**, **animated mood gauge with particles**. |

---

## TECHNICAL STACK
- **Platform:** Chrome Extension (Manifest V3)
- **Frontend:** React 19 + TypeScript
- **Styling:** Tailwind CSS 4
- **Charts:** Recharts + Custom SVG Sparklines
- **Game:** HTML5 Canvas API (no external libraries)
- **Build Tool:** Vite
- **Storage:** Chrome Storage API
- **Language:** TypeScript

---

## APIS USED (All Free!)

| API | Purpose | Auth Required |
|-----|---------|---------------|
| **CoinGecko** | Live crypto prices, 24h change, sparklines | ❌ No |
| **Alternative.me** | Official Fear & Greed Index (0-100) | ❌ No |
| **DefiLlama** | Top DeFi yields, protocol TVL | ❌ No |
| **Google Gemini** | AI market analysis with 6 personas | ✅ API Key |
| **Firecrawl** | Crypto news scraping | ✅ API Key |

---

## CORE FEATURES

### 1. 📊 Fear & Greed Index (REAL API!)
**Service:** `src/services/alternativeme.ts`  
**Hook:** `src/hooks/useFearGreed.ts`

**Data Source:** Alternative.me Crypto Fear & Greed Index API  
**Endpoint:** `https://api.alternative.me/fng/`

**Score Interpretation:**
| Score | State | Emoji |
|-------|-------|-------|
| 0-24 | Extreme Fear | 💀 |
| 25-49 | Fear | 😰 |
| 50-74 | Greed | 🔥 |
| 75-100 | Extreme Greed | 🚀 |

**Component:** `src/popup/components/FearGreedGauge.tsx`

**Visual Features:**
- Floating animated particles (rise when bullish, fall when bearish)
- Dynamic pulsing emoji
- Animated glow effects (color-coded)
- Full gradient mood bar with animated needle indicator
- 5-minute cache, auto-refresh

---

### 2. 🤖 AI Market Summary with 6 Personas
**Service:** `src/services/gemini.ts`, `src/services/personas.ts`

#### 🎭 THE 6 AI TRADING PERSONAS

| # | Persona | Emoji | Style | Example |
|---|---------|-------|-------|---------|
| 1 | **The Analyst** | 🧠 | Professional, data-driven | "Based on Fear & Greed of 67 and +2.3% BTC momentum..." |
| 2 | **The Degen Ape** | 🦍 | WAGMI, slang, emojis | "SER WE ARE SO BACK 🚀🦍 WAGMI! NFA 💎🙌" |
| 3 | **The Gambler** | 🎰 | Probability, odds | "Bullish probability: 68%. R/R: 1:3.2 🎲" |
| 4 | **The Zen Master** | 🧘 | Calm, philosophical | "The market breathes... patience rewards 🕊️" |
| 5 | **The News Anchor** | 📰 | Breaking news | "BREAKING: Sentiment shifts to GREED..." |
| 6 | **The Pirate Captain** | 🏴‍☠️ | Pirate speak | "AHOY! The winds be favorable! YARRR! ⚓" |

#### Context-Aware Analysis
- AI focuses on **your selected coins** only
- Yields filtered to match **your tracked tokens**
- Example: If you track BTC, ETH, SOL → AI says: "Your portfolio shows SOL leading at +4.1%..."

**Components:** 
- `src/popup/components/AISummary.tsx`
- `src/popup/components/PersonaSelector.tsx`

---

### 3. 🎯 AI Action Cards
**Component:** `src/popup/components/ActionCardsBar.tsx`, `src/popup/components/ActionCard.tsx`

#### Card Types
| Type | Icon | Color | When Shown |
|------|------|-------|------------|
| **Yield** | 💰 | Green | Top DeFi yield available |
| **Alert** | 🚀/⚠️ | Yellow | Coin moving >3% |
| **Degen** | 🎲 | Purple | Degen/Gambler persona |
| **Safe** | 🛡️ | Blue | Fear & Greed < 40 |

---

### 4. 💰 Live Coin Tracker (REAL DATA!)
**Service:** `src/services/coingecko.ts`

**API:** CoinGecko Public API  
**Endpoint:** `https://api.coingecko.com/api/v3/coins/markets`

**Features:**
- Real-time prices from CoinGecko API
- Auto-refresh every 30 seconds
- Price flash animation (green up, red down)
- 7-day sparkline charts (168 hourly data points)
- Max 5 coins tracked
- 30-second cache to avoid rate limiting

**Components:** `CoinCard.tsx`, `Sparkline.tsx`, `CoinSelector.tsx`

---

### 5. 📈 DeFi Yields Section
**Service:** `src/services/defillama.ts`

**API:** DefiLlama Yields API  
**Endpoint:** `https://yields.llama.fi/pools`

**Features:**
- Top yield opportunities filtered by your tracked tokens
- Color coded: 🟢 >5% | 🟡 2-5% | ⚪ <2%
- "🔥 HOT" badge for >8% APY
- Filters: TVL > $1M, APY < 100%

**Component:** `src/popup/components/YieldCard.tsx`

---

### 6. 📰 News Ticker
**Service:** `src/services/firecrawl.ts`

**Features:**
- Carousel with auto-rotate (5 seconds)
- Sentiment badges: 🟢 Positive | 🔴 Negative | ⚪ Neutral
- Mock data fallback

**Component:** `src/popup/components/NewsTicker.tsx`

---

## 🎮 CRYPTO SURVIVOR MINI-GAME

### Overview
A crypto-themed survival game. Dodge obstacles using mouse control.

**Location:** `src/popup/components/CryptoSurvivor/`

### Game Files
```
src/popup/components/CryptoSurvivor/
├── CryptoSurvivorGame.tsx    # Main game component (400×600 full screen)
├── GameCanvas.tsx            # Canvas rendering
├── gameTypes.ts              # TypeScript interfaces
├── gameLogic.ts              # Collision detection & mechanics
└── obstacles.ts              # Obstacle spawning system
```

### Game Mechanics
| Element | Specification |
|---------|---------------|
| **Canvas Size** | 400×600px (full extension) |
| **Player Control** | Mouse position |
| **Obstacles** | Thin lines (3-6px), spawn from edges |
| **Power-ups** | Shield (blocks 1 hit), Mini (shrink player), Slow |
| **Target FPS** | 60 FPS |

### Controls
| Input | Action |
|-------|--------|
| **Mouse** | Move player |
| **ESC** | Close game / Return to dashboard |

---

## 🎴 3D CARD FLIP ANIMATION

**Component:** `src/popup/components/CardFlip.tsx`

| Side | Content |
|------|---------|
| **Front** | Main Dashboard |
| **Back** | Crypto Survivor Mini-Game |

| Property | Value |
|----------|-------|
| **Duration** | 0.8 seconds |
| **Transform** | `rotateY(180deg)` |
| **Perspective** | 1200px |

---

## 📁 PROJECT STRUCTURE

```
crypto-vibe-dashboard/
├── public/
│   ├── manifest.json
│   └── icons/
├── src/
│   ├── popup/
│   │   ├── index.html
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── App.tsx
│   │   └── components/
│   │       ├── CardFlip.tsx
│   │       ├── FearGreedGauge.tsx        # Animated with particles
│   │       ├── AISummary.tsx
│   │       ├── PersonaSelector.tsx
│   │       ├── ActionCardsBar.tsx
│   │       ├── ActionCard.tsx
│   │       ├── CoinCard.tsx
│   │       ├── CoinSelector.tsx
│   │       ├── Sparkline.tsx
│   │       ├── YieldCard.tsx
│   │       ├── NewsTicker.tsx
│   │       ├── Mascot.tsx
│   │       ├── Confetti.tsx
│   │       ├── StreakCounter.tsx
│   │       ├── PredictionGame.tsx
│   │       └── CryptoSurvivor/
│   │           ├── CryptoSurvivorGame.tsx
│   │           ├── GameCanvas.tsx
│   │           ├── gameTypes.ts
│   │           ├── gameLogic.ts
│   │           └── obstacles.ts
│   ├── services/
│   │   ├── coingecko.ts
│   │   ├── alternativeme.ts              # Fear & Greed API
│   │   ├── defillama.ts
│   │   ├── gemini.ts
│   │   ├── personas.ts
│   │   ├── firecrawl.ts
│   │   └── storage.ts
│   ├── hooks/
│   │   ├── useCoins.ts
│   │   ├── useFearGreed.ts               # Uses Alternative.me
│   │   ├── useAI.ts
│   │   └── useNews.ts
│   ├── types/
│   │   ├── index.ts
│   │   └── actionCards.ts
│   └── utils/
│       ├── fearGreedCalculator.ts
│       ├── formatters.ts
│       └── sentiment.ts
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── ARCHITECTURE.md
```

---

## 🔑 ENVIRONMENT VARIABLES

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_FIRECRAWL_API_KEY=your_firecrawl_api_key
```

---

## 🚀 BUILD & DEPLOY

```bash
# Install dependencies
npm install

# Development (hot reload)
npm run dev

# Production build
npm run build

# Load in Chrome:
# 1. Go to chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked"
# 4. Select the `dist/` folder
```

---

## ⚡ BUSINESS RULES

| Rule | Value |
|------|-------|
| Price auto-refresh | Every 30 seconds |
| Fear & Greed refresh | Every 5 minutes |
| Yields refresh | Every 5 minutes |
| AI refresh | Manual only |
| Max tracked coins | 5 |
| Game FPS | 60 FPS |
| Card flip duration | 0.8 seconds |
| Max action cards | 3 |

---

## 🎬 DEMO CHEAT CODES

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+C` | Force confetti 🎊 |
| `Click 🎮` | Flip to mini-game |
| `ESC` | Flip back to dashboard |
| `🎲 Surprise Me!` | Random AI persona |

---

## ✅ KEY FEATURES SUMMARY

| Feature | API Source | Real Data |
|---------|------------|-----------|
| Fear & Greed Index | Alternative.me | ✅ Yes |
| Live Crypto Prices | CoinGecko | ✅ Yes |
| 7-Day Sparklines | CoinGecko | ✅ Yes |
| DeFi Yields | DefiLlama | ✅ Yes |
| AI Analysis | Google Gemini | ✅ Yes |
| 6 AI Personas | Local + Gemini | ✅ Yes |
| Crypto Survivor Game | Local Canvas | N/A |
| 3D Card Flip | CSS Transform | N/A |

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
