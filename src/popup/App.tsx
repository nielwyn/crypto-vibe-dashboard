import { useEffect, useState } from 'react';
import { MoodGauge } from './components/MoodGauge';
import { AISummary } from './components/AISummary';
import { CoinCard } from './components/CoinCard';
import { CoinSelector } from './components/CoinSelector';
import { NewsTicker } from './components/NewsTicker';
import { RefreshIndicator } from './components/RefreshIndicator';
import { useCoins } from '../hooks/useCoins';
import { useAI } from '../hooks/useAI';
import { useNews } from '../hooks/useNews';
import { calculateMarketSentiment } from '../utils/sentiment';
import { CoinData } from '../types';

function App() {
  const { coins, loading: coinsLoading, selectedCoins, lastUpdated, updateSelectedCoins } = useCoins();
  const { analysis, loading: aiLoading, generateAnalysis, loadCachedAnalysis } = useAI();
  const { news } = useNews();
  
  const [previousPrices, setPreviousPrices] = useState<Record<string, number>>({});
  
  const sentiment = calculateMarketSentiment(coins);

  useEffect(() => {
    loadCachedAnalysis();
  }, [loadCachedAnalysis]);

  useEffect(() => {
    // Track price changes for flash animation
    const newPrices: Record<string, number> = {};
    coins.forEach((coin) => {
      newPrices[coin.id] = coin.current_price;
    });
    setPreviousPrices(newPrices);
  }, [coins]);

  const handleRefreshAI = () => {
    if (coins.length > 0) {
      generateAnalysis(coins);
    }
  };

  return (
    <div className="w-[400px] h-[600px] bg-crypto-dark text-white overflow-y-auto">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Crypto Vibe Dashboard
          </h1>
          {lastUpdated && <RefreshIndicator lastUpdated={lastUpdated} />}
        </div>

        {/* Market Mood Gauge */}
        {!coinsLoading && coins.length > 0 && (
          <MoodGauge sentiment={sentiment} />
        )}

        {/* AI Summary */}
        <AISummary
          analysis={analysis}
          loading={aiLoading}
          onRefresh={handleRefreshAI}
        />

        {/* Coin Selector */}
        <div className="mb-4">
          <CoinSelector
            selectedCoins={selectedCoins}
            onUpdateCoins={updateSelectedCoins}
          />
        </div>

        {/* Coin Cards */}
        <div className="space-y-3 mb-4">
          {coinsLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-900 rounded-lg p-4 animate-pulse">
                  <div className="h-6 bg-gray-800 rounded w-1/3 mb-2" />
                  <div className="h-8 bg-gray-800 rounded w-1/2 mb-2" />
                  <div className="h-10 bg-gray-800 rounded" />
                </div>
              ))}
            </>
          ) : (
            coins.map((coin: CoinData) => (
              <CoinCard
                key={coin.id}
                coin={coin}
                previousPrice={previousPrices[coin.id]}
              />
            ))
          )}
        </div>

        {/* News Ticker */}
        {news.length > 0 && <NewsTicker news={news} />}
      </div>
    </div>
  );
}

export default App;
