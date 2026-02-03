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
        className="w-6 h-6 rounded-full bg-gray-700 text-white text-sm hover:bg-gray-600 transition-colors flex items-center justify-center"
        title="Select coins"
      >
        +
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] w-[350px] max-h-[500px] bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-white font-medium">Select Coins</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            
            <div className="p-4 max-h-[400px] overflow-y-auto scrollbar-thin">
              <div className="text-xs text-gray-500 mb-3">
                {selectedCoins.length}/5 selected (min 1)
              </div>
              
              {AVAILABLE_COINS.map((coin) => {
                const isSelected = selectedCoins.includes(coin.id);
                const canSelect = selectedCoins.length < 5 || isSelected;
                const isLastSelected = isSelected && selectedCoins.length === 1;

                return (
                  <button
                    key={coin.id}
                    onClick={() => !isLastSelected && toggleCoin(coin.id)}
                    disabled={!canSelect && !isSelected}
                    className={`w-full text-left px-3 py-2 rounded mb-2 transition-colors ${
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
