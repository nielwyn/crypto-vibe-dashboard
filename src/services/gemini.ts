import { GoogleGenAI } from '@google/genai';
import { AIAnalysis, CoinData, YieldPool, FearGreedData } from '../types';
import { ActionCard } from '../types/actionCards';
import { getPersonaById } from './personas';

export const gemini = {
  async generateAnalysis(
    coins: CoinData[], 
    mode: 'professional' | 'degen' = 'professional', 
    yields: YieldPool[] = [],
    fearGreed?: FearGreedData,
    personaId?: string
  ): Promise<AIAnalysis> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    // Use personaId if provided, fallback to mode-based persona
    const actualPersonaId = personaId || (mode === 'degen' ? 'degen' : 'analyst');
    const persona = getPersonaById(actualPersonaId);

    if (!apiKey) {
      console.warn('Gemini API key not found, using mock data');
      return getMockAnalysis(coins, actualPersonaId, yields, fearGreed);
    }

    try {
      const genAI = new GoogleGenAI({ apiKey });

      const prompt = getPersonaPrompt(coins, yields, fearGreed, persona);

      const response = await genAI.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });
      const text = response.text ?? '';

      const actionCards = generateActionCards(coins, yields, fearGreed, actualPersonaId);

      return {
        summary: text,
        generatedAt: Date.now(),
        basedOn: coins,
        actionCards,
        persona: actualPersonaId,
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      return getMockAnalysis(coins, actualPersonaId, yields, fearGreed);
    }
  },
};

function getPersonaPrompt(coins: CoinData[], yields: YieldPool[], fearGreed: FearGreedData | undefined, persona: any): string {
  let prompt = persona.promptPrefix + '\n\nAnalyze the current crypto market based on this data:\n';

  if (fearGreed) {
    prompt += `
Fear & Greed Index: ${fearGreed.score} (${fearGreed.state.replace('-', ' ').toUpperCase()})
Components:
- Volatility Score: ${fearGreed.components.volatility}
- Momentum Score: ${fearGreed.components.momentum}
- BTC Dominance Score: ${fearGreed.components.btcDominance}
`;
  }

  prompt += `
Price Data:
${coins.map(c => `${c.name} (${c.symbol.toUpperCase()}): $${c.current_price.toFixed(2)}, 24h change: ${c.price_change_percentage_24h.toFixed(2)}%`).join('\n')}`;

  if (yields.length > 0) {
    prompt += `\n\nTop DeFi Yields:
${yields.map(y => `${y.project} on ${y.chain} (${y.symbol}): ${y.apy.toFixed(2)}% APY, TVL: $${(y.tvlUsd / 1_000_000).toFixed(0)}M`).join('\n')}`;
  }

  prompt += `\n\nProvide concise analysis (2-3 paragraphs) in your persona's style.`;

  return prompt;
}

function generateActionCards(coins: CoinData[], yields: YieldPool[], fearGreed: FearGreedData | undefined, personaId: string): ActionCard[] {
  const cards: ActionCard[] = [];
  
  // 1. Yield Card - always show if yields exist
  if (yields.length > 0) {
    const topYield = yields[0];
    const risk = topYield.apy > 20 ? 'medium' : 'low';
    cards.push({
      id: 'yield-1',
      type: 'yield',
      icon: '💰',
      title: `${topYield.project} Yield`,
      description: `${topYield.symbol} on ${topYield.chain}`,
      risk,
      metric: 'APY',
      metricValue: `${topYield.apy.toFixed(2)}%`,
      confidence: Math.min(95, 70 + (topYield.tvlUsd / 10_000_000))
    });
  }
  
  // 2. Alert Card - if any coin moved > 3%
  const bigMovers = coins.filter(c => Math.abs(c.price_change_percentage_24h) > 3);
  if (bigMovers.length > 0) {
    const mover = bigMovers[0];
    const isUp = mover.price_change_percentage_24h > 0;
    cards.push({
      id: 'alert-1',
      type: 'alert',
      icon: isUp ? '🚀' : '⚠️',
      title: `${mover.name} ${isUp ? 'Rally' : 'Correction'}`,
      description: `${isUp ? 'Up' : 'Down'} ${Math.abs(mover.price_change_percentage_24h).toFixed(2)}% in 24h`,
      risk: 'medium',
      confidence: Math.min(85, 60 + Math.abs(mover.price_change_percentage_24h) * 2)
    });
  }
  
  // 3. Degen Card - if persona is degen/gambler
  if ((personaId === 'degen' || personaId === 'gambler') && coins.length > 0) {
    const volatileCoin = coins.reduce((prev, curr) => 
      Math.abs(curr.price_change_percentage_24h) > Math.abs(prev.price_change_percentage_24h) ? curr : prev
    );
    cards.push({
      id: 'degen-1',
      type: 'degen',
      icon: '🎲',
      title: `High Risk ${volatileCoin.name} Play`,
      description: `Volatile momentum - ${volatileCoin.price_change_percentage_24h > 0 ? 'catch the wave' : 'potential bounce'}`,
      risk: 'high',
      confidence: 55
    });
  }
  
  // 4. Safe Card - if Fear & Greed < 40
  if (fearGreed && fearGreed.score < 40 && cards.length < 3) {
    cards.push({
      id: 'safe-1',
      type: 'safe',
      icon: '🛡️',
      title: 'Stablecoin Strategy',
      description: 'Market fear detected - consider stable assets',
      risk: 'low',
      metric: 'Safety',
      metricValue: 'High',
      confidence: 90
    });
  }
  
  // Return max 3 cards
  return cards.slice(0, 3);
}

function getMockAnalysis(coins: CoinData[], personaId: string = 'analyst', yields: YieldPool[] = [], fearGreed?: FearGreedData): AIAnalysis {
  const avgChange = coins.reduce((sum, c) => sum + c.price_change_percentage_24h, 0) / coins.length;
  const sentiment = avgChange > 2 ? 'bullish' : avgChange < -2 ? 'bearish' : 'neutral';

  const ethCoin = coins.find(c => c.id === 'ethereum');
  const ethChange = ethCoin ? ethCoin.price_change_percentage_24h : 0;

  const solCoin = coins.find(c => c.id === 'solana');
  const solChange = solCoin ? solCoin.price_change_percentage_24h : 0;

  const topYield = yields.length > 0 ? yields[0] : null;
  
  const fearGreedState = fearGreed ? fearGreed.state.replace('-', ' ').toUpperCase() : 'NEUTRAL';
  const fearGreedScore = fearGreed ? fearGreed.score : 50;

  const actionCards = generateActionCards(coins, yields, fearGreed, personaId);

  let summary = '';

  // Generate persona-specific summaries
  switch (personaId) {
    case 'analyst':
      const yieldInfo = topYield
        ? ` For yield opportunities, ${topYield.project} on ${topYield.chain} is offering ${topYield.apy.toFixed(2)}% APY on ${topYield.symbol} with a TVL of $${(topYield.tvlUsd / 1_000_000).toFixed(0)}M, presenting a solid risk-adjusted return.`
        : '';
      summary = `The crypto market is showing ${sentiment} sentiment with an average 24-hour change of ${avgChange.toFixed(2)}%. The Fear & Greed Index stands at ${fearGreedScore} (${fearGreedState}), indicating ${fearGreedScore >= 50 ? 'bullish' : 'bearish'} market psychology. Bitcoin continues to lead the market, while Ethereum shows ${ethChange > 0 ? 'positive' : 'negative'} momentum.\n\nAltcoins like Solana are demonstrating ${solChange > 0 ? 'strength' : 'weakness'}, reflecting broader market dynamics.${yieldInfo} Traders should monitor key support and resistance levels as volatility remains elevated.\n\nLooking ahead, market participants are focusing on macro factors and technical indicators. The current price action suggests ${sentiment === 'bullish' ? 'continued upside potential' : sentiment === 'bearish' ? 'consolidation or correction' : 'sideways movement'} in the near term.`;
      break;

    case 'degen':
      summary = avgChange > 5
        ? `🚀🚀🚀 WAGMI frens! Fear & Greed at ${fearGreedScore} (${fearGreedState})! Market is absolutely bullish af with ${avgChange.toFixed(2)}% avg gains! 🤑💎🙌\n\nBTC leading the charge to the moon, ETH showing ${ethChange > 0 ? 'diamond hands energy' : 'some paper hands vibes'}, and SOL ${solChange > 5 ? 'going parabolic! Wen lambo?' : 'doing its thing'}. This is not financial advice but... ape in? 🦍\n\n${topYield ? `WHERE TO APE: ${topYield.project} offering ${topYield.apy.toFixed(2)}% APY on ${topYield.symbol} on ${topYield.chain}! That's some juicy yield farming ser 🚜💰 NFA but... might wanna check that out! ` : ''}WAGMI mindset activated! ${topYield ? 'Stack those yields!' : 'Stay patient, fren - the next pump is coming!'} 💪🔥`
        : avgChange < -5
          ? `😱 Market getting REKT harder than a degen's portfolio after 100x leverage! Fear & Greed: ${fearGreedScore} (${fearGreedState})! 📉 Down ${Math.abs(avgChange).toFixed(2)}% - paper hands are panicking!\n\nBTC looking shaky, ETH ${ethChange < -5 ? 'absolutely dumping' : 'holding on barely'}, SOL ${solChange < -5 ? 'in full panic mode' : 'trying to survive'}. This is the part where diamond hands are forged, fren. 💎\n\n${topYield ? `WHERE TO APE: ${topYield.project} offering ${topYield.apy.toFixed(2)}% APY on ${topYield.symbol} on ${topYield.chain}! That's some juicy yield farming ser 🚜💰 NFA but... might wanna check that out! ` : ''}WAGMI mindset activated! Stay patient, fren - the next pump is coming! 💪🔥`
          : `📊 Market doing that classic sideways crab action with ${avgChange.toFixed(2)}% change. Fear & Greed: ${fearGreedScore} (${fearGreedState}). Neither moon nor rekt - we're just vibing! 🦀\n\nBTC consolidating, ETH ${ethChange > 0 ? 'slightly green' : 'slightly red'}, SOL ${solChange > 0 ? 'pumping a bit' : 'dumping a bit'}. Perfect time to DCA and stack sats, ser! 📈\n\n${topYield ? `WHERE TO APE: ${topYield.project} offering ${topYield.apy.toFixed(2)}% APY on ${topYield.symbol} on ${topYield.chain}! That's some juicy yield farming ser 🚜💰 NFA but... might wanna check that out! ` : ''}WAGMI mindset activated! ${topYield ? 'Stack those yields!' : 'Stay patient, fren - the next pump is coming!'} 💪🔥`;
      break;

    case 'gambler':
      const bullProb = Math.min(95, Math.max(5, 50 + avgChange * 5));
      const riskReward = avgChange > 0 ? '1:3.2' : '1:2.5';
      summary = `Analyzing the odds: Bullish probability sits at ${bullProb.toFixed(0)}%. Fear & Greed Index: ${fearGreedScore} (${fearGreedState}) - ${fearGreedScore >= 60 ? 'the house is hot' : fearGreedScore <= 40 ? 'fear creates value' : 'neutral territory'}. 🎲\n\nMarket movement: ${avgChange.toFixed(2)}% average change. Risk/Reward ratio: ${riskReward}. ETH ${ethChange > 0 ? 'showing strength' : 'showing weakness'} (${ethChange.toFixed(2)}%), SOL ${solChange > 0 ? 'in the green' : 'in the red'} (${solChange.toFixed(2)}%). ${topYield ? `Best yield bet: ${topYield.project} at ${topYield.apy.toFixed(2)}% APY - calculated opportunity. 🃏` : ''}\n\nThe odds ${sentiment === 'bullish' ? 'favor the bulls' : sentiment === 'bearish' ? 'lean bearish' : 'are even'}. Smart money stays prepared. Position sizing is key. 🎰`;
      break;

    case 'zen':
      summary = `The market flows like water, showing ${sentiment} energy with ${avgChange.toFixed(2)}% movement. The Fear & Greed Index reflects ${fearGreedScore >= 60 ? 'excessive enthusiasm' : fearGreedScore <= 40 ? 'unnecessary worry' : 'balanced emotion'} at ${fearGreedScore}. 🕊️\n\nBitcoin leads with steady presence. Ethereum ${ethChange > 0 ? 'rises like the morning sun' : 'rests like the evening tide'}, while Solana ${solChange > 0 ? 'climbs the mountain path' : 'descends into the valley'}. ${topYield ? `For those who seek growth, ${topYield.project} offers ${topYield.apy.toFixed(2)}% - a patient harvest. 🌱` : ''}\n\nRemember: Trees do not grow overnight. The wise trader ${sentiment === 'bullish' ? 'rides the wind without rush' : sentiment === 'bearish' ? 'finds opportunity in stillness' : 'observes without forcing'}. Patience rewards the centered mind.`;
      break;

    case 'anchor':
      summary = `BREAKING: Crypto markets ${sentiment.toUpperCase()} with ${avgChange > 0 ? '+' : ''}${avgChange.toFixed(2)}% average movement across major assets. 📰\n\nTOP STORIES:\n▸ Fear & Greed Index: ${fearGreedScore}/100 (${fearGreedState})\n▸ Bitcoin: Market leader maintains position\n▸ Ethereum: ${ethChange > 0 ? 'UP' : 'DOWN'} ${Math.abs(ethChange).toFixed(2)}% in 24 hours\n▸ Solana: ${solChange > 0 ? 'GAINS' : 'LOSSES'} of ${Math.abs(solChange).toFixed(2)}%${topYield ? `\n▸ DeFi Highlight: ${topYield.project} yields ${topYield.apy.toFixed(2)}% APY` : ''}\n\nMARKET OUTLOOK: Analysts suggest ${sentiment === 'bullish' ? 'continued strength ahead' : sentiment === 'bearish' ? 'caution in near term' : 'consolidation likely'}. Stay tuned for more updates.`;
      break;

    case 'pirate':
      summary = `AHOY CRYPTO SAILORS! ⚓ The market seas be ${sentiment === 'bullish' ? 'FAVORABLE' : sentiment === 'bearish' ? 'ROUGH' : 'CALM'} with ${avgChange > 0 ? '' : 'a '}${Math.abs(avgChange).toFixed(2)}% ${avgChange > 0 ? 'treasure gains' : 'losses on the voyage'}! Fear & Greed compass points to ${fearGreedScore} (${fearGreedState})! 🏴‍☠️\n\nBitcoin be the flagship leading the fleet! Ethereum shows ${ethChange > 0 ? 'mighty cannons firing' : 'some barnacles on the hull'} (${ethChange > 0 ? '+' : ''}${ethChange.toFixed(2)}%), and Solana be ${solChange > 0 ? 'sailing fast' : 'taking on water'} (${solChange > 0 ? '+' : ''}${solChange.toFixed(2)}%)! ${topYield ? `TREASURE SPOTTED at ${topYield.project} - ${topYield.apy.toFixed(2)}% APY booty awaits ye brave souls! 💰` : ''}\n\nThe winds ${sentiment === 'bullish' ? 'blow strong to fortune' : sentiment === 'bearish' ? 'warn of storms ahead' : 'be steady fer now'}! Hoist the sails and may yer wallets overflow with crypto treasure! YARRR! 🦜`;
      break;

    default:
      summary = `Market analysis unavailable for unknown persona.`;
  }

  return {
    summary,
    generatedAt: Date.now(),
    basedOn: coins,
    actionCards,
    persona: personaId,
  };
}
