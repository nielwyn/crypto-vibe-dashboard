import React, { useState } from 'react';

interface CoinSelectorProps {
  selectedCoins: string[];
  onUpdateCoins: (coins: string[]) => void;
}

const AVAILABLE_COINS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
  { id: 'ripple', name: 'XRP', symbol: 'XRP' },
  { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX' },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC' },
  { id: 'chainlink', name: 'Chainlink', symbol: 'LINK' },
  { id: 'uniswap', name: 'Uniswap', symbol: 'UNI' },
];

export const CoinSelector: React.FC<CoinSelectorProps> = ({
  selectedCoins,
  onUpdateCoins,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCoin = (coinId: string) => {
    if (selectedCoins.includes(coinId)) {
      if (selectedCoins.length > 1) {
        onUpdateCoins(selectedCoins.filter((id) => id !== coinId));
      }
    } else {
      if (selectedCoins.length < 5) {
        onUpdateCoins([...selectedCoins, coinId]);
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center justify-between transition-colors"
      >
        <span className="text-sm">
          {selectedCoins.length} coin{selectedCoins.length !== 1 ? 's' : ''} tracked
        </span>
        <span className="text-lg">⚙️</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 w-full mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-h-64 overflow-y-auto">
            <div className="p-3 border-b border-gray-700">
              <div className="text-sm font-semibold text-gray-400 mb-1">
                Select Coins (Max 5)
              </div>
              <div className="text-xs text-gray-500">
                {selectedCoins.length}/5 selected
              </div>
            </div>
            
            <div className="p-2">
              {AVAILABLE_COINS.map((coin) => {
                const isSelected = selectedCoins.includes(coin.id);
                const canSelect = selectedCoins.length < 5 || isSelected;
                const isLastSelected = isSelected && selectedCoins.length === 1;

                return (
                  <button
                    key={coin.id}
                    onClick={() => !isLastSelected && toggleCoin(coin.id)}
                    disabled={!canSelect && !isSelected}
                    className={`w-full text-left px-3 py-2 rounded transition-colors ${
                      isSelected
                        ? 'bg-purple-900/30 text-white'
                        : canSelect
                        ? 'hover:bg-gray-800 text-gray-300'
                        : 'text-gray-600 cursor-not-allowed'
                    } ${isLastSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">
                          {coin.symbol}
                        </span>
                        <span className="text-xs text-gray-500">
                          {coin.name}
                        </span>
                      </div>
                      <div className="text-sm">
                        {isSelected ? '✓' : '+'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
