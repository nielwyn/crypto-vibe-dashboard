import React, { useState, useEffect, useCallback } from 'react';
import { GameCanvas } from './GameCanvas';
import { GameState } from './gameTypes';
import { updateGame } from './gameLogic';
import { spawnObstacle, getSpawnInterval } from './obstacles';
import { storage } from '../../../services/storage';

interface CryptoSurvivorGameProps {
  onClose: () => void;
  embedded?: boolean; // New prop for card flip mode
}

export const CryptoSurvivorGame: React.FC<CryptoSurvivorGameProps> = ({ onClose, embedded = false }) => {
  const [gameState, setGameState] = useState<GameState>({
    status: 'start',
    score: 0,
    highScore: 0,
    playerAngle: -Math.PI / 2, // Start at top
    playerDirection: 1,
    obstacles: [],
    startTime: 0,
    lastSpawnTime: 0,
  });

  // Load high score on mount
  useEffect(() => {
    storage.getGameHighScore().then(hs => {
      setGameState(prev => ({ ...prev, highScore: hs }));
    });
  }, []);

  // Toggle direction on click/space
  const handleToggle = useCallback(() => {
    if (gameState.status === 'start') {
      // Start game
      setGameState(prev => ({
        ...prev,
        status: 'playing',
        startTime: Date.now(),
        lastSpawnTime: Date.now(),
        obstacles: [],
        score: 0,
        playerAngle: -Math.PI / 2,
      }));
    } else if (gameState.status === 'playing') {
      // Toggle direction
      setGameState(prev => ({
        ...prev,
        playerDirection: prev.playerDirection === 1 ? -1 : 1,
      }));
    } else if (gameState.status === 'gameover') {
      // Restart
      setGameState(prev => ({
        ...prev,
        status: 'start',
      }));
    }
  }, [gameState.status]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        handleToggle();
      }
      if (e.code === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleToggle, onClose]);

  // Game loop
  useEffect(() => {
    if (gameState.status !== 'playing') return;

    const gameLoop = setInterval(() => {
      setGameState(prev => {
        let updated = updateGame(prev);
        
        // Spawn new obstacles
        const now = Date.now();
        const elapsed = (now - prev.startTime) / 1000;
        const spawnInterval = getSpawnInterval(elapsed);
        
        if (now - prev.lastSpawnTime > spawnInterval) {
          const difficulty = Math.min(elapsed / 30, 2); // Max difficulty at 60s
          updated = {
            ...updated,
            obstacles: [...updated.obstacles, spawnObstacle(difficulty)],
            lastSpawnTime: now,
          };
        }
        
        // Save high score on game over
        if (updated.status === 'gameover' && updated.score > prev.highScore) {
          storage.setGameHighScore(updated.score);
        }
        
        return updated;
      });
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(gameLoop);
  }, [gameState.status]);

  const getGameOverMessage = () => {
    const messages = [
      "You got REKT! 📉",
      "Paper hands detected 📄",
      "The FUD was too strong!",
      "Should've diamond handed 💎",
      "NGMI this time 😅",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // If embedded, render without the overlay wrapper
  if (embedded) {
    return (
      <div className="h-full w-full bg-[#0b0f17] flex flex-col">
        {/* Header with close button */}
        <div className="flex items-center justify-between p-3 border-b border-gray-800">
          <h2 className="text-lg font-bold text-[#7ef3c5]">🎮 Crypto Survivor</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-800 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
        
        {/* Game canvas area */}
        <div 
          className="flex-1 flex items-center justify-center p-2"
          onClick={handleToggle}
        >
          <div className="relative">
            <GameCanvas gameState={gameState} width={360} height={480} />
            
            {/* Overlays */}
            {gameState.status === 'start' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <h2 className="text-2xl font-bold text-[#7ef3c5] mb-2">
                  💎 CRYPTO SURVIVOR 💎
                </h2>
                <p className="text-gray-400 mb-4">Dodge the FUD!</p>
                <p className="text-sm text-gray-500 mb-4">
                  Click or Space to toggle direction
                </p>
                <p className="text-[#7ef3c5] animate-pulse">
                  Click to Start
                </p>
                {gameState.highScore > 0 && (
                  <p className="text-sm text-gray-500 mt-4">
                    Best HODL: {gameState.highScore}
                  </p>
                )}
              </div>
            )}

            {gameState.status === 'playing' && (
              <div className="absolute top-4 left-4 text-white">
                <div className="text-xs text-gray-400">HODL TIME</div>
                <div className="text-2xl font-bold text-[#7ef3c5]">
                  {gameState.score}
                </div>
              </div>
            )}

            {gameState.status === 'gameover' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black/70">
                <h2 className="text-xl font-bold text-[#ff7b7b] mb-2">
                  {getGameOverMessage()}
                </h2>
                <div className="text-3xl font-bold text-white my-4">
                  {gameState.score}
                </div>
                {gameState.score >= gameState.highScore && gameState.score > 0 && (
                  <p className="text-[#ffdd99] mb-2">🏆 NEW HIGH SCORE!</p>
                )}
                <p className="text-sm text-gray-400 mb-4">
                  Best HODL: {gameState.highScore}
                </p>
                <p className="text-[#7ef3c5] animate-pulse">
                  Click to Retry
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer with controls hint */}
        <div className="p-2 text-center text-xs text-gray-500 border-t border-gray-800">
          Space / Click = Toggle Direction | ESC = Back
        </div>
      </div>
    );
  }

  // Original overlay mode for backwards compatibility
  return (
    <div 
      className="fixed inset-0 bg-black/90 z-[70] flex items-center justify-center"
      onClick={handleToggle}
    >
      <div className="relative" onClick={e => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-gray-400 hover:text-white z-10"
        >
          ✕ Close (Esc)
        </button>

        {/* Game canvas */}
        <div 
          className="relative rounded-lg overflow-hidden border border-gray-700"
          onClick={handleToggle}
        >
          <GameCanvas gameState={gameState} width={360} height={480} />
          
          {/* Overlays */}
          {gameState.status === 'start' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <h2 className="text-2xl font-bold text-[#7ef3c5] mb-2">
                💎 CRYPTO SURVIVOR 💎
              </h2>
              <p className="text-gray-400 mb-4">Dodge the FUD!</p>
              <p className="text-sm text-gray-500 mb-4">
                Click or Space to toggle direction
              </p>
              <p className="text-[#7ef3c5] animate-pulse">
                Click to Start
              </p>
              {gameState.highScore > 0 && (
                <p className="text-sm text-gray-500 mt-4">
                  Best HODL: {gameState.highScore}
                </p>
              )}
            </div>
          )}

          {gameState.status === 'playing' && (
            <div className="absolute top-4 left-4 text-white">
              <div className="text-xs text-gray-400">HODL TIME</div>
              <div className="text-2xl font-bold text-[#7ef3c5]">
                {gameState.score}
              </div>
            </div>
          )}

          {gameState.status === 'gameover' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black/70">
              <h2 className="text-xl font-bold text-[#ff7b7b] mb-2">
                {getGameOverMessage()}
              </h2>
              <div className="text-3xl font-bold text-white my-4">
                {gameState.score}
              </div>
              {gameState.score >= gameState.highScore && gameState.score > 0 && (
                <p className="text-[#ffdd99] mb-2">🏆 NEW HIGH SCORE!</p>
              )}
              <p className="text-sm text-gray-400 mb-4">
                Best HODL: {gameState.highScore}
              </p>
              <p className="text-[#7ef3c5] animate-pulse">
                Click to Retry
              </p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="text-center mt-4 text-sm text-gray-500">
          Space / Click = Toggle Direction | Esc = Close
        </div>
      </div>
    </div>
  );
};
