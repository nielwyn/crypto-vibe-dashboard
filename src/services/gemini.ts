import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIAnalysis, CoinData } from '../types';

export const gemini = {
  async generateAnalysis(coins: CoinData[], mode: 'professional' | 'degen' = 'professional'): Promise<AIAnalysis> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn('Gemini API key not found, using mock data');
      return getMockAnalysis(coins, mode);
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = mode === 'degen' 
        ? getDegenPrompt(coins)
        : getProfessionalPrompt(coins);

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        summary: text,
        generatedAt: Date.now(),
        basedOn: coins,
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      return getMockAnalysis(coins, mode);
    }
  },
};

function getProfessionalPrompt(coins: CoinData[]): string {
  return `Analyze the current crypto market based on this data:
${coins.map(c => `${c.name} (${c.symbol.toUpperCase()}): $${c.current_price.toFixed(2)}, 24h change: ${c.price_change_percentage_24h.toFixed(2)}%`).join('\n')}

Provide a 2-3 paragraph analysis covering:
1. Overall market sentiment and key trends
2. Notable price movements and what they might indicate
3. Brief outlook for the near term

Keep it concise, insightful, and suitable for crypto investors.`;
}

function getDegenPrompt(coins: CoinData[]): string {
  return `You are a crypto degen analyst. Analyze this market data but make it funny and use crypto slang.
Use terms like: WAGMI, NGMI, rekt, ape in, diamond hands, paper hands, moon, lambo, wen, ser, fren, gm, bullish af, bearish af.
Add emojis. Be dramatic and entertaining but still informative.
Keep it to 2-3 short paragraphs.

Data:
${coins.map(c => `${c.name} (${c.symbol.toUpperCase()}): $${c.current_price.toFixed(2)}, 24h change: ${c.price_change_percentage_24h.toFixed(2)}%`).join('\n')}`;
}

function getMockAnalysis(coins: CoinData[], mode: 'professional' | 'degen' = 'professional'): AIAnalysis {
  const avgChange = coins.reduce((sum, c) => sum + c.price_change_percentage_24h, 0) / coins.length;
  const sentiment = avgChange > 2 ? 'bullish' : avgChange < -2 ? 'bearish' : 'neutral';
  
  const ethCoin = coins.find(c => c.id === 'ethereum');
  const ethChange = ethCoin ? ethCoin.price_change_percentage_24h : 0;
  
  const solCoin = coins.find(c => c.id === 'solana');
  const solChange = solCoin ? solCoin.price_change_percentage_24h : 0;
  
  if (mode === 'degen') {
    return {
      summary: avgChange > 5
        ? `🚀🚀🚀 WAGMI frens! Market is absolutely bullish af with ${avgChange.toFixed(2)}% avg gains! 🤑💎🙌\n\nBTC leading the charge to the moon, ETH showing ${ethChange > 0 ? 'diamond hands energy' : 'some paper hands vibes'}, and SOL ${solChange > 5 ? 'going parabolic! Wen lambo?' : 'doing its thing'}. This is not financial advice but... ape in? 🦍\n\nNFA ser, but if you're not buying this dip/rip, that's kinda NGMI behavior. Stay strong, HODL tight, and remember: we're all gonna make it! 🔥💪`
        : avgChange < -5
        ? `😱 Market getting REKT harder than a degen's portfolio after 100x leverage! 📉 Down ${Math.abs(avgChange).toFixed(2)}% - paper hands are panicking!\n\nBTC looking shaky, ETH ${ethChange < -5 ? 'absolutely dumping' : 'holding on barely'}, SOL ${solChange < -5 ? 'in full panic mode' : 'trying to survive'}. This is the part where diamond hands are forged, fren. 💎\n\nWen recovery? Nobody knows ser. But remember, zoom out! This too shall pass. NGMI if you sell now. HODL strong and touch grass if needed. 🌿`
        : `📊 Market doing that classic sideways crab action with ${avgChange.toFixed(2)}% change. Neither moon nor rekt - we're just vibing! 🦀\n\nBTC consolidating, ETH ${ethChange > 0 ? 'slightly green' : 'slightly red'}, SOL ${solChange > 0 ? 'pumping a bit' : 'dumping a bit'}. Perfect time to DCA and stack sats, ser! 📈\n\nWAGMI mindset activated! This is accumulation szn. Stay patient, fren - the next pump is coming! 💪🔥`,
      generatedAt: Date.now(),
      basedOn: coins,
    };
  }
  
  return {
    summary: `The crypto market is showing ${sentiment} sentiment with an average 24-hour change of ${avgChange.toFixed(2)}%. Bitcoin continues to lead the market, while Ethereum shows ${ethChange > 0 ? 'positive' : 'negative'} momentum.

Altcoins like Solana are demonstrating ${solChange > 0 ? 'strength' : 'weakness'}, reflecting broader market dynamics. Traders should monitor key support and resistance levels as volatility remains elevated.

Looking ahead, market participants are focusing on macro factors and technical indicators. The current price action suggests ${sentiment === 'bullish' ? 'continued upside potential' : sentiment === 'bearish' ? 'consolidation or correction' : 'sideways movement'} in the near term.`,
    generatedAt: Date.now(),
    basedOn: coins,
  };
}
