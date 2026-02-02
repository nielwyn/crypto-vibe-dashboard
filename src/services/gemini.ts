import { GoogleGenAI } from '@google/genai';
import { AIAnalysis, CoinData, YieldPool } from '../types';

export const gemini = {
  async generateAnalysis(coins: CoinData[], mode: 'professional' | 'degen' = 'professional', yields: YieldPool[] = []): Promise<AIAnalysis> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('Gemini API key not found, using mock data');
      return getMockAnalysis(coins, mode, yields);
    }

    try {
      const genAI = new GoogleGenAI({ apiKey });

      const prompt = mode === 'degen'
        ? getDegenPrompt(coins, yields)
        : getProfessionalPrompt(coins, yields);

      const response = await genAI.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });
      const text = response.text ?? '';

      return {
        summary: text,
        generatedAt: Date.now(),
        basedOn: coins,
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      return getMockAnalysis(coins, mode, yields);
    }
  },
};

function getProfessionalPrompt(coins: CoinData[], yields: YieldPool[]): string {
  let prompt = `Analyze the current crypto market based on this data:

Price Data:
${coins.map(c => `${c.name} (${c.symbol.toUpperCase()}): $${c.current_price.toFixed(2)}, 24h change: ${c.price_change_percentage_24h.toFixed(2)}%`).join('\n')}`;

  if (yields.length > 0) {
    prompt += `\n\nTop DeFi Yields:
${yields.map(y => `${y.project} on ${y.chain} (${y.symbol}): ${y.apy.toFixed(2)}% APY, TVL: $${(y.tvlUsd / 1_000_000).toFixed(0)}M`).join('\n')}`;
  }

  prompt += `\n\nProvide:
1. Market sentiment analysis (2 sentences)`;

  if (yields.length > 0) {
    prompt += `\n2. Best yield opportunity recommendation (1 sentence)`;
  }

  prompt += `\n3. Brief outlook (1 sentence)

Keep it concise and actionable.`;

  return prompt;
}

function getDegenPrompt(coins: CoinData[], yields: YieldPool[]): string {
  let prompt = `You are a crypto degen analyst. Analyze this market data but make it funny and use crypto slang.
Use terms like: WAGMI, NGMI, rekt, ape in, diamond hands, paper hands, moon, lambo, wen, ser, fren, gm, bullish af, bearish af.
Add emojis. Be dramatic and entertaining but still informative.
Keep it to 2-3 short paragraphs.

Price Data:
${coins.map(c => `${c.name} (${c.symbol.toUpperCase()}): $${c.current_price.toFixed(2)}, 24h change: ${c.price_change_percentage_24h.toFixed(2)}%`).join('\n')}`;

  if (yields.length > 0) {
    prompt += `\n\nTop DeFi Yields:
${yields.map(y => `${y.project} on ${y.chain} (${y.symbol}): ${y.apy.toFixed(2)}% APY`).join('\n')}

Include:
1. Market vibe check (funny)
2. "Where to ape" - best yield recommendation (make it exciting)
3. Degen advice (not financial advice ser)`;
  }

  return prompt;
}

function getMockAnalysis(coins: CoinData[], mode: 'professional' | 'degen' = 'professional', yields: YieldPool[] = []): AIAnalysis {
  const avgChange = coins.reduce((sum, c) => sum + c.price_change_percentage_24h, 0) / coins.length;
  const sentiment = avgChange > 2 ? 'bullish' : avgChange < -2 ? 'bearish' : 'neutral';

  const ethCoin = coins.find(c => c.id === 'ethereum');
  const ethChange = ethCoin ? ethCoin.price_change_percentage_24h : 0;

  const solCoin = coins.find(c => c.id === 'solana');
  const solChange = solCoin ? solCoin.price_change_percentage_24h : 0;

  const topYield = yields.length > 0 ? yields[0] : null;

  if (mode === 'degen') {
    let summary = avgChange > 5
      ? `🚀🚀🚀 WAGMI frens! Market is absolutely bullish af with ${avgChange.toFixed(2)}% avg gains! 🤑💎🙌\n\nBTC leading the charge to the moon, ETH showing ${ethChange > 0 ? 'diamond hands energy' : 'some paper hands vibes'}, and SOL ${solChange > 5 ? 'going parabolic! Wen lambo?' : 'doing its thing'}. This is not financial advice but... ape in? 🦍\n\n`
      : avgChange < -5
        ? `😱 Market getting REKT harder than a degen's portfolio after 100x leverage! 📉 Down ${Math.abs(avgChange).toFixed(2)}% - paper hands are panicking!\n\nBTC looking shaky, ETH ${ethChange < -5 ? 'absolutely dumping' : 'holding on barely'}, SOL ${solChange < -5 ? 'in full panic mode' : 'trying to survive'}. This is the part where diamond hands are forged, fren. 💎\n\n`
        : `📊 Market doing that classic sideways crab action with ${avgChange.toFixed(2)}% change. Neither moon nor rekt - we're just vibing! 🦀\n\nBTC consolidating, ETH ${ethChange > 0 ? 'slightly green' : 'slightly red'}, SOL ${solChange > 0 ? 'pumping a bit' : 'dumping a bit'}. Perfect time to DCA and stack sats, ser! 📈\n\n`;

    if (topYield) {
      summary += `WHERE TO APE: ${topYield.project} offering ${topYield.apy.toFixed(2)}% APY on ${topYield.symbol} on ${topYield.chain}! That's some juicy yield farming ser 🚜💰 NFA but... might wanna check that out! `;
    }

    summary += `WAGMI mindset activated! ${topYield ? 'Stack those yields!' : 'Stay patient, fren - the next pump is coming!'} 💪🔥`;

    return {
      summary,
      generatedAt: Date.now(),
      basedOn: coins,
    };
  }

  // Professional mode summary
  const yieldInfo = topYield
    ? ` For yield opportunities, ${topYield.project} on ${topYield.chain} is offering ${topYield.apy.toFixed(2)}% APY on ${topYield.symbol} with a TVL of $${(topYield.tvlUsd / 1_000_000).toFixed(0)}M, presenting a solid risk-adjusted return.`
    : '';

  const summary = `The crypto market is showing ${sentiment} sentiment with an average 24-hour change of ${avgChange.toFixed(2)}%. Bitcoin continues to lead the market, while Ethereum shows ${ethChange > 0 ? 'positive' : 'negative'} momentum.

Altcoins like Solana are demonstrating ${solChange > 0 ? 'strength' : 'weakness'}, reflecting broader market dynamics.${yieldInfo} Traders should monitor key support and resistance levels as volatility remains elevated.

Looking ahead, market participants are focusing on macro factors and technical indicators. The current price action suggests ${sentiment === 'bullish' ? 'continued upside potential' : sentiment === 'bearish' ? 'consolidation or correction' : 'sideways movement'} in the near term.`;

  return {
    summary,
    generatedAt: Date.now(),
    basedOn: coins,
  };
}
