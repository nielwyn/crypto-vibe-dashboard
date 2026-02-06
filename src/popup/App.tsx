import { useEffect, useRef, useState } from 'react';
import { useDragScroll } from '../hooks/useDragScroll';
import { FearGreedGauge } from './components/FearGreedGauge';
import { AISummary } from './components/AISummary';
import { CoinCard } from './components/CoinCard';
import { CoinSelector } from './components/CoinSelector';
import { TimeframeSelector, ChartTimeframe } from './components/TimeframeSelector';
import { NewsTicker } from './components/NewsTicker';
import { RefreshIndicator } from './components/RefreshIndicator';
import { Confetti } from './components/Confetti';
import { YieldsSection } from './components/YieldsSection';
import { CryptoSurvivorGame } from './components/CryptoSurvivor/CryptoSurvivorGame';
import { CardFlip } from './components/CardFlip';
import { ActionCardsBar } from './components/ActionCardsBar';
import { TokenDetailModal } from './components/TokenDetailModal';
import { useCoins } from '../hooks/useCoins';
import { useAI } from '../hooks/useAI';
import { useNews } from '../hooks/useNews';
import { useYields } from '../hooks/useYields';
import { useFearGreed } from '../hooks/useFearGreed';
import { CoinData, UserStats } from '../types';
import { storage } from '../services/storage';

function App() {
  const { coins, loading: coinsLoading, selectedCoins, lastUpdated, updateSelectedCoins, isUpdating } = useCoins();
  const { analysis, loading: aiLoading, generateAnalysis, loadCachedAnalysis } = useAI();
  const { news } = useNews();
  const [selectedTokenForDetail, setSelectedTokenForDetail] = useState<CoinData | null>(null);
  // General yields for main page (no symbol filter)
  const { yields, loading: yieldsLoading } = useYields();
  const { fearGreed } = useFearGreed(coins);
  
  const [aiMode, setAiMode] = useState<'professional' | 'degen'>('professional');
  const [selectedPersona, setSelectedPersona] = useState<string>('analyst');
  const [chartTimeframe, setChartTimeframe] = useState<ChartTimeframe>('7d');
  const [userStats, setUserStats] = useState<UserStats>({
    streak: 0,
    lastVisit: 0,
    totalChecks: 0,
    predictions: [],
    badges: [],
  });
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const [isGoldenDay, setIsGoldenDay] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const coinScrollRef = useDragScroll<HTMLDivElement>();
  const hasGeneratedMarketAnalysis = useRef(false);

  // Load AI mode preference
  useEffect(() => {
    const loadPreferences = async () => {
      const prefs = await storage.getPreferences();
      setAiMode(prefs.aiMode);
      setSelectedPersona(prefs.aiPersona || 'analyst');
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

  // Generate market-wide analysis when coins load
  useEffect(() => {
    if (coins.length > 0 && !hasGeneratedMarketAnalysis.current) {
      hasGeneratedMarketAnalysis.current = true;
      generateAnalysis(coins, aiMode, yields, fearGreed, selectedPersona, true);
    }
  }, [coins, aiMode, yields, fearGreed, selectedPersona, generateAnalysis]);

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
      generateAnalysis(coins, aiMode, yields, fearGreed, selectedPersona, true);
    }
  };

  const handleModeChange = async (mode: 'professional' | 'degen') => {
    setAiMode(mode);
    const prefs = await storage.getPreferences();
    prefs.aiMode = mode;
    await storage.setPreferences(prefs);
    
    // Regenerate market analysis with new mode
    if (coins.length > 0) {
      generateAnalysis(coins, mode, yields, fearGreed, selectedPersona, true);
    }
  };

  const handlePersonaChange = (personaId: string) => {
    setSelectedPersona(personaId);
    // Regenerate market analysis with new persona
    if (coins.length > 0) {
      generateAnalysis(coins, aiMode, yields, fearGreed, personaId, true);
    }
  };

  const handleTokenClick = (coin: CoinData) => {
    setSelectedTokenForDetail(coin);
  };

  // Get mood-based background classes - Phantom style
  const getMoodBackground = () => {
    if (fearGreed.score >= 50) {
      return 'popup-container [box-shadow:inset_0_0_100px_rgba(20,241,149,0.05)]';
    } else if (fearGreed.score < 50) {
      return 'popup-container [box-shadow:inset_0_0_100px_rgba(244,63,94,0.05)]';
    }
    return 'popup-container';
  };

  // Dashboard content (front of card)
  const dashboardContent = (
    <div className={`h-full transition-all duration-1000 ${getMoodBackground()}`}>
      {/* Confetti overlay */}
      <Confetti trigger={confettiTrigger} isGoldenDay={isGoldenDay} />
      
      {/* Phantom-style Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-[#0f0f1a]/95 border-b border-[#3d4470]/50 z-50 px-4 flex items-center justify-center backdrop-blur-xl">
        <h1 className="text-lg font-bold phantom-gradient-text tracking-wide">CRYPTO VIBE</h1>
      </header>

      {/* Scrollable Content Area */}
      <div className="content-area scrollbar-thin">
        {/* Golden Day Celebration */}
        {isGoldenDay && confettiTrigger && (
          <div className="mb-4 bg-gradient-to-r from-[#4a6caa] via-[#14f195] to-[#4a6caa] text-white font-bold text-center py-3 rounded-2xl animate-pulse phantom-glow">
            🎉 GOLDEN DAY! All coins +10%! 🎉
          </div>
        )}

        {/* Fear & Greed Index Gauge */}
        {!coinsLoading && coins.length > 0 && (
          <FearGreedGauge fearGreed={fearGreed} />
        )}

        {/* Live Prices Section - Phantom Style (User selects token first) */}
        <div className="phantom-card p-4 mb-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-white">Live Prices</span>
              <TimeframeSelector 
                selected={chartTimeframe} 
                onChange={setChartTimeframe} 
              />
              {isUpdating && (
                <span className="w-2 h-2 bg-[#ab9ff2] rounded-full animate-pulse" title="Updating..." />
              )}
            </div>
            <div className="flex items-center gap-2">
              {lastUpdated && <RefreshIndicator lastUpdated={lastUpdated} />}
              <CoinSelector
                selectedCoins={selectedCoins}
                onUpdateCoins={updateSelectedCoins}
              />
            </div>
          </div>
          
          {/* Horizontal scroll container with drag-to-scroll */}
          <div ref={coinScrollRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {coinsLoading && coins.length === 0 ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex-shrink-0 w-28 bg-[#1a1a3e]/50 rounded-xl p-3 animate-pulse">
                    <div className="h-3 bg-[#2a2a4a] rounded mb-2" />
                    <div className="h-5 bg-[#2a2a4a] rounded mb-2" />
                    <div className="h-10 bg-[#2a2a4a] rounded" />
                  </div>
                ))}
              </>
            ) : (
              coins.map((coin: CoinData) => (
                <button
                  key={coin.id}
                  onClick={() => handleTokenClick(coin)}
                  className="m-1 flex-shrink-0 rounded-xl transition-all hover:ring-2 hover:ring-[#ab9ff2]/50"
                  title={`View ${coin.name} details`}
                >
                  <CoinCard
                    coin={coin}
                    timeframe={chartTimeframe}
                  />
                </button>
              ))
            )}
          </div>
          
          {/* Timeframe label */}
          <div className="mt-3 flex items-center justify-between text-xs text-[#8da4d4]/60">
            <span>{chartTimeframe === '24h' ? 'Last 24 hours' : 'Last 7 days'}</span>
            {coins.length > 0 && <span>{coins.length} coin{coins.length !== 1 ? 's' : ''}</span>}
          </div>
        </div>

        {/* AI Summary - Market Overview */}
        <AISummary
          analysis={analysis}
          loading={aiLoading}
          onRefresh={handleRefreshAI}
          mode={aiMode}
          onModeChange={handleModeChange}
          onPersonaChange={handlePersonaChange}
          isMarketOverview={true}
        />

        {/* Yields Section - Top Market Yields */}
        <YieldsSection yields={yields} loading={yieldsLoading} />

        {/* Action Cards Section - In scroll area */}
        {!coinsLoading && coins.length > 0 && analysis?.actionCards && analysis.actionCards.length > 0 && (
          <ActionCardsBar cards={analysis.actionCards} />
        )}

        {/* News Ticker */}
        {news.length > 0 && <NewsTicker news={news} />}
      </div>

      {/* Phantom-style Footer */}
      {!coinsLoading && coins.length > 0 && (
        <footer className="fixed bottom-0 left-0 right-0 h-14 bg-[#0f0f1a]/95 border-t border-[#3d4470]/50 px-4 flex items-center justify-between z-50 backdrop-blur-xl">
          <div className="flex items-center gap-2 bg-[#1e2040]/60 px-3 py-1.5 rounded-full border border-[#3d4470]/50">
            <span className="text-[#e85a7b] text-sm">🔥</span>
            <span className="text-sm font-semibold text-white">{userStats.streak}</span>
          </div>
          
          <button
            onClick={() => setShowGame(true)}
            className="text-gray-500 hover:text-[#7ef3c5] transition-colors text-lg"
            title="Play Crypto Survivor!"
          >
            🎮
          </button>
        </footer>
      )}
    </div>
  );

  // Game content (back of card)
  const gameContent = (
    <CryptoSurvivorGame onClose={() => setShowGame(false)} embedded={true} />
  );

  return (
    <>
      <CardFlip
        isFlipped={showGame}
        frontContent={dashboardContent}
        backContent={gameContent}
      />
      
      {/* Token Detail Modal */}
      {selectedTokenForDetail && (
        <TokenDetailModal
          coin={selectedTokenForDetail}
          fearGreed={fearGreed}
          aiMode={aiMode}
          selectedPersona={selectedPersona}
          onClose={() => setSelectedTokenForDetail(null)}
        />
      )}
    </>
  );
}

export default App;
