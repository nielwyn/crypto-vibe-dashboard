import React, { useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';

interface CoinSelectorProps {
  selectedCoins: string[];
  onUpdateCoins: (coins: string[]) => void;
}

const AVAILABLE_COINS = [
  // Top 10 by market cap
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', category: 'Layer 1' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', category: 'Layer 1' },
  { id: 'binancecoin', name: 'BNB', symbol: 'BNB', category: 'Layer 1' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', category: 'Layer 1' },
  { id: 'ripple', name: 'XRP', symbol: 'XRP', category: 'Payments' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', category: 'Layer 1' },
  { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX', category: 'Layer 1' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', category: 'Meme' },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', category: 'Layer 0' },
  { id: 'tron', name: 'TRON', symbol: 'TRX', category: 'Layer 1' },
  
  // DeFi
  { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', category: 'DeFi' },
  { id: 'uniswap', name: 'Uniswap', symbol: 'UNI', category: 'DeFi' },
  { id: 'aave', name: 'Aave', symbol: 'AAVE', category: 'DeFi' },
  { id: 'maker', name: 'Maker', symbol: 'MKR', category: 'DeFi' },
  { id: 'lido-dao', name: 'Lido DAO', symbol: 'LDO', category: 'DeFi' },
  
  // Layer 2
  { id: 'matic-network', name: 'Polygon', symbol: 'MATIC', category: 'Layer 2' },
  { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB', category: 'Layer 2' },
  { id: 'optimism', name: 'Optimism', symbol: 'OP', category: 'Layer 2' },
  
  // Other popular
  { id: 'shiba-inu', name: 'Shiba Inu', symbol: 'SHIB', category: 'Meme' },
  { id: 'litecoin', name: 'Litecoin', symbol: 'LTC', category: 'Payments' },
  { id: 'bitcoin-cash', name: 'Bitcoin Cash', symbol: 'BCH', category: 'Payments' },
  { id: 'stellar', name: 'Stellar', symbol: 'XLM', category: 'Payments' },
  { id: 'cosmos', name: 'Cosmos', symbol: 'ATOM', category: 'Layer 0' },
  { id: 'near', name: 'NEAR Protocol', symbol: 'NEAR', category: 'Layer 1' },
  { id: 'aptos', name: 'Aptos', symbol: 'APT', category: 'Layer 1' },
  { id: 'sui', name: 'Sui', symbol: 'SUI', category: 'Layer 1' },
  { id: 'injective-protocol', name: 'Injective', symbol: 'INJ', category: 'DeFi' },
  { id: 'render-token', name: 'Render', symbol: 'RNDR', category: 'AI' },
  { id: 'fetch-ai', name: 'Fetch.ai', symbol: 'FET', category: 'AI' },
  { id: 'the-graph', name: 'The Graph', symbol: 'GRT', category: 'Infrastructure' },
];

const CATEGORIES = ['All', 'Layer 1', 'Layer 2', 'DeFi', 'Meme', 'Payments', 'Layer 0', 'AI', 'Infrastructure'];

export const CoinSelector: React.FC<CoinSelectorProps> = ({
  selectedCoins,
  onUpdateCoins,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [pendingSelection, setPendingSelection] = useState<string[]>(selectedCoins);

  // Sync pending selection when modal opens
  const handleOpen = useCallback(() => {
    setPendingSelection(selectedCoins);
    setIsOpen(true);
    setSearchQuery('');
    setSelectedCategory('All');
  }, [selectedCoins]);

  // Filter coins based on search and category, with selected coins at top
  const filteredCoins = useMemo(() => {
    const filtered = AVAILABLE_COINS.filter(coin => {
      const matchesSearch = 
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || coin.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    
    // Sort: selected coins first, then alphabetically by symbol
    return filtered.sort((a, b) => {
      const aSelected = pendingSelection.includes(a.id);
      const bSelected = pendingSelection.includes(b.id);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return a.symbol.localeCompare(b.symbol);
    });
  }, [searchQuery, selectedCategory, pendingSelection]);

  const toggleCoin = useCallback((coinId: string) => {
    setPendingSelection(prev => {
      if (prev.includes(coinId)) {
        // Don't allow removing if it's the last one
        if (prev.length <= 1) return prev;
        return prev.filter(id => id !== coinId);
      } else {
        // Don't allow adding if already at max
        if (prev.length >= 5) return prev;
        return [...prev, coinId];
      }
    });
  }, []);

  const handleSave = useCallback(() => {
    if (pendingSelection.length > 0) {
      onUpdateCoins(pendingSelection);
    }
    setIsOpen(false);
  }, [pendingSelection, onUpdateCoins]);

  const handleCancel = useCallback(() => {
    setPendingSelection(selectedCoins);
    setIsOpen(false);
  }, [selectedCoins]);

  const hasChanges = useMemo(() => {
    if (pendingSelection.length !== selectedCoins.length) return true;
    return !pendingSelection.every(id => selectedCoins.includes(id));
  }, [pendingSelection, selectedCoins]);

  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  const handleSelectCategory = useCallback((cat: string) => {
    setSelectedCategory(cat);
    setShowCategoryFilter(false);
  }, []);

  // Count coins per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: AVAILABLE_COINS.length };
    AVAILABLE_COINS.forEach(coin => {
      counts[coin.category] = (counts[coin.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="w-6 h-6 rounded-full bg-[#5a7cc0] text-white text-sm hover:bg-[#4a6caa] transition-colors flex items-center justify-center"
        title="Select coins"
      >
        +
      </button>

      {isOpen && createPortal(
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/80"
            onClick={handleCancel}
          />
          <div className="fixed inset-0 z-[60] bg-[#0f0f1a] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#3d4470] flex-shrink-0">
              <h3 className="text-white font-medium">Select Tokens</h3>
              <button onClick={handleCancel} className="text-[#8da4d4] hover:text-white text-xl">✕</button>
            </div>
            
            {/* Search */}
            <div className="p-3 border-b border-[#3d4470] flex-shrink-0">
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 bg-[#1e2040] border border-[#3d4470] rounded-lg text-white text-sm placeholder-[#8da4d4]/50 focus:outline-none focus:border-[#5a7cc0]"
                autoFocus
              />
            </div>

            {/* Category Filter - Collapsible */}
            <div className="border-b border-[#3d4470] flex-shrink-0">
              {/* Toggle Button */}
              <button
                onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                className="w-full px-4 py-3 flex items-center justify-between text-sm hover:bg-[#1e2040]/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#8da4d4]">Filter:</span>
                  <span className="text-white font-medium">{selectedCategory}</span>
                  {selectedCategory !== 'All' && (
                    <span className="text-xs text-[#8da4d4]/60">({categoryCounts[selectedCategory] || 0})</span>
                  )}
                </div>
                <svg 
                  className={`w-4 h-4 text-[#8da4d4] transition-transform ${showCategoryFilter ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Category Options */}
              {showCategoryFilter && (
                <div className="bg-[#0f0f1a] border-t border-[#3d4470]">
                  <div className="grid grid-cols-2 gap-1 p-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => handleSelectCategory(cat)}
                        className={`px-3 py-2.5 text-sm rounded-lg text-left transition-colors flex items-center justify-between ${
                          selectedCategory === cat
                            ? 'bg-[#5a7cc0] text-white'
                            : 'bg-[#1e2040]/50 text-gray-300 hover:bg-[#1e2040]'
                        }`}
                      >
                        <span>{cat}</span>
                        <span className={`text-xs ${selectedCategory === cat ? 'text-blue-200' : 'text-[#8da4d4]/60'}`}>
                          {categoryCounts[cat] || 0}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Selection info */}
            <div className="px-4 py-2 bg-[#0f0f1a] text-xs text-[#8da4d4]/60 flex-shrink-0">
              {pendingSelection.length}/5 selected (min 1, max 5)
            </div>
            
            {/* Coin list - takes remaining space */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {filteredCoins.map((coin) => {
                const isSelected = pendingSelection.includes(coin.id);
                const canSelect = pendingSelection.length < 5 || isSelected;
                const isLastSelected = isSelected && pendingSelection.length === 1;

                return (
                  <button
                    key={coin.id}
                    onClick={() => !isLastSelected && toggleCoin(coin.id)}
                    disabled={!canSelect && !isSelected}
                    className={`w-full text-left px-4 py-2.5 transition-colors border-b border-[#3d4470]/50 ${
                      isSelected
                        ? 'bg-[#5a7cc0]/20 text-white'
                        : canSelect
                        ? 'hover:bg-[#1e2040]/50 text-gray-300'
                        : 'text-gray-600 cursor-not-allowed'
                    } ${isLastSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          isSelected ? 'border-[#5a7cc0] bg-[#5a7cc0]' : 'border-[#3d4470]'
                        }`}>
                          {isSelected && <span className="text-white text-xs">✓</span>}
                        </div>
                        <div>
                          <span className="text-sm font-semibold">{coin.symbol}</span>
                          <span className="text-xs text-[#8da4d4]/60 ml-2">{coin.name}</span>
                        </div>
                      </div>
                      <span className="text-xs text-[#8da4d4]/50">{coin.category}</span>
                    </div>
                  </button>
                );
              })}
              {filteredCoins.length === 0 && (
                <div className="px-4 py-8 text-center text-[#8da4d4]/50 text-sm">
                  No tokens found
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-[#3d4470] bg-[#0f0f1a] flex-shrink-0">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm text-[#8da4d4] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={pendingSelection.length === 0}
                className={`px-6 py-2 text-sm rounded-lg transition-colors ${
                  hasChanges && pendingSelection.length > 0
                    ? 'bg-[#5a7cc0] text-white hover:bg-[#4a6caa]'
                    : 'bg-[#1e2040] text-[#8da4d4]/60'
                }`}
              >
                {hasChanges ? 'Save Changes' : 'Done'}
              </button>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};
