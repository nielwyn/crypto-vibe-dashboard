# Crypto Vibe Dashboard 🚀

AI-powered Chrome extension with real-time crypto sentiment, 6 unique AI personas, DeFi yields, and a survival mini-game for Herond Browser users.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
![License](https://img.shields.io/badge/license-ISC-green)

---

## ✨ Features

### 📊 Fear & Greed Index (Real API!)
- **Official Alternative.me API** - Real market sentiment data (0-100 scale)
- Animated mood gauge with floating particles
- Dynamic glow effects (green = greed, red = fear)
- Score states: Extreme Fear 💀 | Fear 😰 | Greed 🔥 | Extreme Greed 🚀

### 🤖 AI Market Summary with 6 Personas
Choose your AI trading companion:

| Persona | Emoji | Style |
|---------|-------|-------|
| **The Analyst** | 🧠 | Professional, data-driven analysis |
| **The Degen Ape** | 🦍 | WAGMI vibes, crypto slang, emojis |
| **The Gambler** | 🎰 | Probability and odds focused |
| **The Zen Master** | 🧘 | Calm, philosophical insights |
| **The News Anchor** | 📰 | Breaking news style |
| **The Pirate Captain** | 🏴‍☠️ | Pirate speak, AHOY! |

- **Context-aware**: AI focuses on YOUR selected coins
- **🎲 Surprise Me**: Random persona selection
- Powered by Google Gemini 2.0 Flash

### 💰 Live Coin Tracker (Real Data!)
- **CoinGecko API** - Real-time prices, no API key required
- Auto-refresh every 30 seconds
- Price flash animations (green ▲ / red ▼)
- 7-day sparkline charts (168 data points)
- Track up to 5 coins

### 🎯 AI Action Cards
Smart recommendations based on market data:
- 💰 **Yield Cards** - Top DeFi opportunities
- 🚀 **Alert Cards** - Coins moving >3%
- 🎲 **Degen Cards** - High-risk plays
- 🛡️ **Safe Cards** - When Fear & Greed < 40

### 📈 DeFi Yields Section
- **DefiLlama API** - Top yield opportunities
- Filtered by your tracked tokens
- Color coded: 🟢 >5% | 🟡 2-5% | ⚪ <2%
- 🔥 HOT badge for >8% APY

### 📰 News Ticker
- Auto-rotating carousel (5 seconds)
- Sentiment badges: 🟢 Positive | 🔴 Negative | ⚪ Neutral
- Click to read full article

### 🎮 Crypto Survivor Mini-Game
A survival game - dodge the FUD!
- Full-screen 400×600px gameplay
- Mouse-controlled player movement
- Power-ups: Shield 🛡️, Mini 🔮, Slow ⏱️
- High score persistence
- Smooth 60 FPS

### 🎴 3D Card Flip Animation
- Click 🎮 to flip between dashboard and game
- Smooth 0.8s 3D transform
- Edge glow effects

### 🎨 Creative Features
- 🎭 **Dynamic Mascot** - Reacts to market mood
- 🎊 **Confetti Celebration** - When all coins are green!
- 🔥 **Daily Streak Counter** - Track consecutive days
- 🎰 **Prediction Game** - Test your market intuition
- 🌈 **Mood-Based Theme** - Subtle glow based on sentiment

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Platform** | Chrome Extension (Manifest V3) |
| **Frontend** | React 19 + TypeScript |
| **Styling** | Tailwind CSS 4 |
| **Charts** | Recharts + Custom SVG Sparklines |
| **Game** | HTML5 Canvas API |
| **Build** | Vite |
| **Storage** | Chrome Storage API |

---

## 🌐 APIs Used

| API | Purpose | Auth |
|-----|---------|------|
| **CoinGecko** | Live prices, sparklines | ❌ Free |
| **Alternative.me** | Fear & Greed Index | ❌ Free |
| **DefiLlama** | DeFi yields | ❌ Free |
| **Google Gemini** | AI analysis | ✅ API Key |
| **Firecrawl** | News scraping | ✅ API Key |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Chrome/Chromium browser

### Installation

```bash
# Clone the repository
git clone https://github.com/nielwyn/crypto-vibe-dashboard.git
cd crypto-vibe-dashboard

# Install dependencies
npm install

# Configure API keys (optional)
cp .env.example .env
# Edit .env with your keys:
# VITE_GEMINI_API_KEY=your_key
# VITE_FIRECRAWL_API_KEY=your_key

# Build the extension
npm run build
```

### Load in Chrome

1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `dist/` folder

---

## 📁 Project Structure

```
crypto-vibe-dashboard/
├── public/
│   ├── manifest.json
│   └── icons/
├── src/
│   ├── popup/
│   │   ├── App.tsx
│   │   └── components/
│   │       ├── FearGreedGauge.tsx    # Animated mood gauge
│   │       ├── AISummary.tsx         # AI analysis
│   │       ├── PersonaSelector.tsx   # 6 persona picker
│   │       ├── ActionCardsBar.tsx    # Action cards
│   │       ├── CoinCard.tsx          # Coin display
│   │       ├── YieldCard.tsx         # DeFi yields
│   │       ├── CardFlip.tsx          # 3D flip animation
│   │       └── CryptoSurvivor/       # Mini-game
│   │           ├── CryptoSurvivorGame.tsx
│   │           ├── GameCanvas.tsx
│   │           └── gameLogic.ts
│   ├── services/
│   │   ├── coingecko.ts              # CoinGecko API
│   │   ├── alternativeme.ts          # Fear & Greed API
│   │   ├── defillama.ts              # DeFi yields API
│   │   ├── gemini.ts                 # Gemini AI
│   │   └── personas.ts               # 6 AI personas
│   ├── hooks/
│   │   ├── useCoins.ts
│   │   ├── useFearGreed.ts
│   │   └── useAI.ts
│   └── types/
│       └── index.ts
├── package.json
├── vite.config.ts
└── README.md
```

---

## ⚡ Business Rules

| Rule | Value |
|------|-------|
| Price refresh | Every 30 seconds |
| Fear & Greed refresh | Every 5 minutes |
| Yields refresh | Every 5 minutes |
| AI refresh | Manual only |
| Max tracked coins | 5 |
| Game FPS | 60 |

---

## 🎬 Demo Cheat Codes

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+C` | Force confetti 🎊 |
| `Click 🎮` | Flip to mini-game |
| `ESC` | Return to dashboard |
| `🎲 Surprise Me!` | Random AI persona |

---

## 🔧 Development

```bash
# Development with hot reload
npm run dev

# Production build
npm run build

# Preview build
npm run preview
```

---

## 📝 API Setup

### Google Gemini (Optional)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Add to `.env`: `VITE_GEMINI_API_KEY=your_key`

### Firecrawl (Optional)
1. Visit [Firecrawl](https://www.firecrawl.dev/)
2. Get API key
3. Add to `.env`: `VITE_FIRECRAWL_API_KEY=your_key`

> **Note:** Extension works without API keys using mock data.

---

## 🏆 Hackathon Scoring

| Criteria | Weight | Implementation |
|----------|--------|----------------|
| **Completion** | 50% | ✅ Live demo with 5 real APIs |
| **Feasibility** | 20% | ✅ Perfect for Herond Browser |
| **AI Usage** | 15% | ✅ 6 AI personas + context-aware |
| **Creativity** | 15% | ✅ Mini-game, 3D flip, particles |

---

## 📄 License

ISC

---

## 🙏 Acknowledgments

- [CoinGecko](https://www.coingecko.com/) - Crypto market data
- [Alternative.me](https://alternative.me/) - Fear & Greed Index
- [DefiLlama](https://defillama.com/) - DeFi yields
- [Google Gemini](https://ai.google.dev/) - AI analysis
- Built for **Herond Browser** users