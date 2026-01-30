# Quick Start Guide - Testing the Extension

## Loading in Chrome

1. **Build the extension** (if not already built):
   ```bash
   npm run build
   ```

2. **Open Chrome Extensions page**:
   - Navigate to `chrome://extensions/`
   - Or click Menu (⋮) > Extensions > Manage Extensions

3. **Enable Developer Mode**:
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the extension**:
   - Click "Load unpacked"
   - Select the `dist/` folder from this project
   - The Crypto Vibe Dashboard should now appear in your extensions

5. **Pin the extension** (optional):
   - Click the puzzle icon in the Chrome toolbar
   - Find "Crypto Vibe Dashboard"
   - Click the pin icon to keep it visible

## Testing Features

### Basic Functionality (No API Keys Required)

The extension works out of the box with mock data:

1. **Market Mood Gauge**:
   - Opens with default coins (BTC, ETH, SOL)
   - Shows bullish/bearish/neutral indicator
   - Updates based on 24h price changes

2. **Live Coin Tracker**:
   - Displays real prices from CoinGecko (free, no key needed)
   - Auto-refreshes every 30 seconds
   - Shows 7-day sparkline charts
   - Flash animation on price updates

3. **Coin Selector**:
   - Click gear icon to open
   - Select up to 5 coins to track
   - Changes persist in Chrome Storage

4. **News Feed**:
   - Shows 5 headlines with sentiment tags
   - Carousel auto-advances every 5 seconds
   - Click dots to navigate manually

### Advanced Features (Requires API Keys)

5. **AI Market Analysis**:
   - Requires `VITE_GEMINI_API_KEY` in `.env`
   - Click "Refresh" to generate analysis
   - Streaming text animation
   - Falls back to mock analysis without API key

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_FIRECRAWL_API_KEY=your_firecrawl_api_key_here
```

**Important**: After adding API keys, you must rebuild:
```bash
npm run build
```

Then reload the extension in Chrome (click the refresh icon on the extension card).

## Troubleshooting

### Extension won't load
- Make sure you're loading the `dist/` folder, not the root folder
- Check that `dist/` contains: manifest.json, popup.html, popup.js, popup.css, icons/

### No data showing
- Check browser console: Right-click extension icon > Inspect popup
- CoinGecko may rate-limit (free tier)
- Try refreshing after a few seconds

### Build errors
```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

## Development

Run in development mode with hot reload:
```bash
npm run dev
```

The extension will rebuild automatically when you make changes to source files.

## Features Checklist

- ✅ Market Mood Indicator with animated gauge
- ✅ AI Market Summary (Gemini API integration)
- ✅ Live Coin Tracker (CoinGecko API)
- ✅ Price flash animations (green up, red down)
- ✅ 7-day sparkline charts
- ✅ News feed with sentiment analysis
- ✅ Coin selector (up to 5 coins)
- ✅ Auto-refresh (coins: 30s, news: 5min)
- ✅ Chrome Storage caching
- ✅ Responsive dark theme UI
- ✅ Smooth animations and transitions
- ✅ Countdown timer indicator
- ✅ Fallback/mock data support

## UI Preview

The extension displays in a 400x600px popup with:
- Dark background (#0f0f0f)
- Green accents for bullish/positive (#00ff88)
- Red accents for bearish/negative (#ff3366)
- Purple gradient header
- Animated components
- Smooth transitions

## Next Steps

1. Load the extension in Chrome as described above
2. Test basic functionality with default coins
3. (Optional) Add API keys for AI analysis
4. Customize coin selection
5. Enjoy real-time crypto market insights!
