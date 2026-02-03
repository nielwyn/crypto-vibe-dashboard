import { useEffect, useState } from 'react';
import { FearGreedGauge } from './components/FearGreedGauge';
import { AISummary } from './components/AISummary';
import { CoinCard } from './components/CoinCard';
import { CoinSelector } from './components/CoinSelector';
import { NewsTicker } from './components/NewsTicker';
import { RefreshIndicator } from './components/RefreshIndicator';
import { Mascot } from './components/Mascot';
import { Confetti } from './components/Confetti';
import { PredictionGame } from './components/PredictionGame';
import { YieldsSection } from './components/YieldsSection';
import { useCoins } from '../hooks/useCoins';
import { useAI } from '../hooks/useAI';
import { useNews } from '../hooks/useNews';
import { useYields } from '../hooks/useYields';
import { useFearGreed } from '../hooks/useFearGreed';
import { CoinData, UserStats } from '../types';
import { storage } from '../services/storage';

function App() {
  const { coins, loading: coinsLoading, selectedCoins, lastUpdated, updateSelectedCoins } = useCoins();
  const { analysis, loading: aiLoading, generateAnalysis, loadCachedAnalysis } = useAI();
  const { news } = useNews();
  const { yields, loading: yieldsLoading } = useYields();
  const { fearGreed } = useFearGreed(coins);
  
  const [previousPrices, setPreviousPrices] = useState<Record<string, number>>({});
  const [aiMode, setAiMode] = useState<'professional' | 'degen'>('professional');
  const [userStats, setUserStats] = useState<UserStats>({
    streak: 0,
    lastVisit: 0,
    totalChecks: 0,
    predictions: [],
    badges: [],
  });
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const [isGoldenDay, setIsGoldenDay] = useState(false);

  // Load AI mode preference
  useEffect(() => {
    const loadPreferences = async () => {
      const prefs = await storage.getPreferences();
      setAiMode(prefs.aiMode);
    };
    loadPreferences();
  }, []);

  // Update streak on mount
  useEffect(() => {
    const updateStreak = async () => {
      const stats = await storage.updateStreak();
      setUserStats(stats);
    };
    updateStreak();
  }, []);

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

  // Check for all-green confetti trigger
  useEffect(() => {
    const checkConfetti = async () => {
      if (coins.length > 0) {
        const allGreen = coins.every(coin => coin.price_change_percentage_24h > 0);
        const allGolden = coins.every(coin => coin.price_change_percentage_24h > 10);
        
        if (allGreen) {
          const hasTriggered = await storage.getConfettiTriggered();
          if (!hasTriggered) {
            setIsGoldenDay(allGolden);
            setConfettiTrigger(true);
            await storage.setConfettiTriggered(true);
            // Reset trigger after animation
            setTimeout(() => setConfettiTrigger(false), 4000);
          }
        }
      }
    };
    checkConfetti();
  }, [coins]);

  // Demo confetti trigger (Ctrl+Shift+C)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        setIsGoldenDay(true);
        setConfettiTrigger(true);
        setTimeout(() => setConfettiTrigger(false), 4000);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleRefreshAI = () => {
    if (coins.length > 0) {
      generateAnalysis(coins, aiMode, yields, fearGreed);
    }
  };

  const handleModeChange = async (mode: 'professional' | 'degen') => {
    setAiMode(mode);
    const prefs = await storage.getPreferences();
    prefs.aiMode = mode;
    await storage.setPreferences(prefs);
    
    // Regenerate analysis with new mode
    if (coins.length > 0) {
      generateAnalysis(coins, mode, yields, fearGreed);
    }
  };

  const handlePredict = async (direction: 'up' | 'down' | 'sideways') => {
    const btcCoin = coins.find(c => c.id === 'bitcoin');
    if (!btcCoin) return;

    const newPrediction = {
      coin: 'bitcoin',
      direction,
      priceAtPrediction: btcCoin.current_price,
      timestamp: Date.now(),
      result: 'pending' as const,
    };

    const stats = await storage.getUserStats();
    stats.predictions.push(newPrediction);
    await storage.setUserStats(stats);
    setUserStats(stats);
  };

  const calculateAccuracy = () => {
    if (userStats.predictions.length === 0) return undefined;
    const completed = userStats.predictions.filter(p => p.result !== 'pending');
    if (completed.length === 0) return 0;
    const correct = completed.filter(p => p.result === 'correct').length;
    return Math.round((correct / completed.length) * 100);
  };

  // Get mood-based background classes
  const getMoodBackground = () => {
    if (fearGreed.score >= 50) {
      return 'bg-gradient-to-b from-crypto-dark via-crypto-dark to-crypto-dark/95 [box-shadow:inset_0_0_80px_rgba(0,255,136,0.1)]';
    } else if (fearGreed.score < 50) {
      return 'bg-gradient-to-b from-crypto-dark via-crypto-dark to-crypto-dark/95 [box-shadow:inset_0_0_80px_rgba(255,51,102,0.1)]';
    }
    return 'bg-crypto-dark';
  };

  return (
    <div className={`popup-container transition-all duration-1000 ${getMoodBackground()}`}>
      {/* Confetti overlay */}
      <Confetti trigger={confettiTrigger} isGoldenDay={isGoldenDay} />
      
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 h-12 bg-[#0f0f0f] border-b border-gray-800 z-50 px-4 flex items-center justify-between">
        {!coinsLoading && coins.length > 0 && (
          <Mascot fearGreed={fearGreed} />
        )}
        <h1 className="text-lg font-bold text-white">CRYPTO VIBE</h1>
        <button 
          className="text-gray-400 hover:text-white transition-colors"
          title="Settings (Coming Soon)"
        >
          ⚙️
        </button>
      </header>

      {/* Scrollable Content Area */}
      <div className="content-area scrollbar-thin">
        {/* Golden Day Celebration */}
        {isGoldenDay && confettiTrigger && (
          <div className="mb-3 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 text-black font-bold text-center py-3 rounded-lg animate-pulse">
            🎉 GOLDEN DAY! All coins +10%! 🎉
          </div>
        )}

        {/* Fear & Greed Index Gauge */}
        {!coinsLoading && coins.length > 0 && (
          <FearGreedGauge fearGreed={fearGreed} />
        )}

        {/* AI Summary */}
        <AISummary
          analysis={analysis}
          loading={aiLoading}
          onRefresh={handleRefreshAI}
          mode={aiMode}
          onModeChange={handleModeChange}
        />

        {/* Live Prices Section */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-3 mb-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-white">📊 Live Prices</span>
            <div className="flex items-center gap-2">
              {lastUpdated && <RefreshIndicator lastUpdated={lastUpdated} />}
              <CoinSelector
                selectedCoins={selectedCoins}
                onUpdateCoins={updateSelectedCoins}
              />
            </div>
          </div>
          
          {/* Horizontal scroll container */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {coinsLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex-shrink-0 w-24 bg-[#242424] rounded-lg p-2 border border-gray-700 animate-pulse">
                    <div className="h-3 bg-gray-700 rounded mb-1" />
                    <div className="h-4 bg-gray-700 rounded mb-1" />
                    <div className="h-8 bg-gray-700 rounded" />
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
        </div>

        {/* Yields Section */}
        <YieldsSection yields={yields} loading={yieldsLoading} />

        {/* News Ticker */}
        {news.length > 0 && <NewsTicker news={news} />}
      </div>

      {/* Fixed Footer */}
      {!coinsLoading && coins.length > 0 && (
        <footer className="fixed bottom-0 left-0 right-0 h-12 bg-[#0f0f0f] border-t border-gray-800 px-4 flex items-center justify-between z-50">
          <div className="flex items-center gap-1">
            <span className="text-orange-400">🔥</span>
            <span className="text-sm text-white">{userStats.streak}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <span className="text-blue-400">🎯</span>
            <span className="text-sm text-white">{calculateAccuracy() || 0}%</span>
          </div>
          
          <PredictionGame
            onPredict={handlePredict}
            accuracy={calculateAccuracy()}
          />
        </footer>
      )}
    </div>
  );
}

export default App;
