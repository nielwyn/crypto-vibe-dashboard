import React, { useState, useCallback, useMemo } from 'react';

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

  // Filter coins based on search and category
  const filteredCoins = useMemo(() => {
    return AVAILABLE_COINS.filter(coin => {
      const matchesSearch = 
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || coin.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

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

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="w-6 h-6 rounded-full bg-purple-600 text-white text-sm hover:bg-purple-500 transition-colors flex items-center justify-center"
        title="Select coins"
      >
        +
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/50"
            onClick={handleCancel}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] w-[350px] max-h-[500px] bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-white font-medium">Select Tokens</h3>
              <button onClick={handleCancel} className="text-gray-400 hover:text-white">✕</button>
            </div>
            
            {/* Search */}
            <div className="p-3 border-b border-gray-800">
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 bg-[#242424] border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
                autoFocus
              />
            </div>

            {/* Category tabs */}
            <div className="px-3 py-2 border-b border-gray-800 overflow-x-auto scrollbar-hide">
              <div className="flex gap-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-1 text-xs rounded whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Selection info */}
            <div className="px-4 py-2 bg-[#141414] text-xs text-gray-500">
              {pendingSelection.length}/5 selected (min 1, max 5)
            </div>
            
            {/* Coin list */}
            <div className="max-h-[250px] overflow-y-auto scrollbar-thin">
              {filteredCoins.map((coin) => {
                const isSelected = pendingSelection.includes(coin.id);
                const canSelect = pendingSelection.length < 5 || isSelected;
                const isLastSelected = isSelected && pendingSelection.length === 1;

                return (
                  <button
                    key={coin.id}
                    onClick={() => !isLastSelected && toggleCoin(coin.id)}
                    disabled={!canSelect && !isSelected}
                    className={`w-full text-left px-4 py-2.5 transition-colors border-b border-gray-800/50 ${
                      isSelected
                        ? 'bg-purple-900/30 text-white'
                        : canSelect
                        ? 'hover:bg-gray-800/50 text-gray-300'
                        : 'text-gray-600 cursor-not-allowed'
                    } ${isLastSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          isSelected ? 'border-purple-500 bg-purple-500' : 'border-gray-600'
                        }`}>
                          {isSelected && <span className="text-white text-xs">✓</span>}
                        </div>
                        <div>
                          <span className="text-sm font-semibold">{coin.symbol}</span>
                          <span className="text-xs text-gray-500 ml-2">{coin.name}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-600">{coin.category}</span>
                    </div>
                  </button>
                );
              })}
              {filteredCoins.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                  No tokens found
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-3 border-t border-gray-700 bg-[#141414]">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={pendingSelection.length === 0}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  hasChanges && pendingSelection.length > 0
                    ? 'bg-purple-600 text-white hover:bg-purple-500'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {hasChanges ? 'Save Changes' : 'Done'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
