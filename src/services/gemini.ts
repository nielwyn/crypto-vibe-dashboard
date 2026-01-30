import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIAnalysis, CoinData } from '../types';

export const gemini = {
  async generateAnalysis(coins: CoinData[]): Promise<AIAnalysis> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn('Gemini API key not found, using mock data');
      return getMockAnalysis(coins);
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Analyze the current crypto market based on this data:
${coins.map(c => `${c.name} (${c.symbol.toUpperCase()}): $${c.current_price.toFixed(2)}, 24h change: ${c.price_change_percentage_24h.toFixed(2)}%`).join('\n')}

Provide a 2-3 paragraph analysis covering:
1. Overall market sentiment and key trends
2. Notable price movements and what they might indicate
3. Brief outlook for the near term

Keep it concise, insightful, and suitable for crypto investors.`;

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
      return getMockAnalysis(coins);
    }
  },
};

function getMockAnalysis(coins: CoinData[]): AIAnalysis {
  const avgChange = coins.reduce((sum, c) => sum + c.price_change_percentage_24h, 0) / coins.length;
  const sentiment = avgChange > 2 ? 'bullish' : avgChange < -2 ? 'bearish' : 'neutral';
  
  const ethCoin = coins.find(c => c.id === 'ethereum');
  const ethChange = ethCoin ? ethCoin.price_change_percentage_24h : 0;
  
  const solCoin = coins.find(c => c.id === 'solana');
  const solChange = solCoin ? solCoin.price_change_percentage_24h : 0;
  
  return {
    summary: `The crypto market is showing ${sentiment} sentiment with an average 24-hour change of ${avgChange.toFixed(2)}%. Bitcoin continues to lead the market, while Ethereum shows ${ethChange > 0 ? 'positive' : 'negative'} momentum.

Altcoins like Solana are demonstrating ${solChange > 0 ? 'strength' : 'weakness'}, reflecting broader market dynamics. Traders should monitor key support and resistance levels as volatility remains elevated.

Looking ahead, market participants are focusing on macro factors and technical indicators. The current price action suggests ${sentiment === 'bullish' ? 'continued upside potential' : sentiment === 'bearish' ? 'consolidation or correction' : 'sideways movement'} in the near term.`,
    generatedAt: Date.now(),
    basedOn: coins,
  };
}
