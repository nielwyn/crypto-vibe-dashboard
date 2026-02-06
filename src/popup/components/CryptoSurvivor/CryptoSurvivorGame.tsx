import React, { useState, useEffect, useCallback } from 'react';
import { GameCanvas } from './GameCanvas';
import { GameState } from './gameTypes';
import { updateGame } from './gameLogic';
import { spawnObstacle, spawnBossObstacle, getSpawnInterval } from './obstacles';
import { spawnPowerUp } from './powerups';
import { storage } from '../../../services/storage';
import { POWER_UP_SPAWN_INTERVAL_MIN, POWER_UP_SPAWN_INTERVAL_RANGE, MAX_POWER_UPS } from './constants';

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
    particles: [],
    powerUps: [],
    activePowerUps: [],
    scorePopups: [],
    wave: 1,
    combo: 0,
    lastNearMissTime: 0,
    screenShake: 0,
    lastPowerUpSpawn: 0,
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
        const centerX = 360 / 2;
        const centerY = embedded ? 400 / 2 : 480 / 2;
        const width = 360;
        const height = embedded ? 400 : 480;
        
        let updated = updateGame(prev, centerX, centerY, width, height);
        
        // Spawn new obstacles
        const now = Date.now();
        const elapsed = (now - prev.startTime) / 1000;
        const spawnInterval = getSpawnInterval(elapsed, updated.wave);
        
        if (now - prev.lastSpawnTime > spawnInterval) {
          const difficulty = Math.min(elapsed / 30, 2); // Max difficulty at 60s
          
          // Check for boss spawn (every 30 seconds)
          const shouldSpawnBoss = Math.floor(elapsed / 30) > Math.floor((elapsed - spawnInterval / 1000) / 30);
          
          if (shouldSpawnBoss && elapsed > 30) {
            updated = {
              ...updated,
              obstacles: [...updated.obstacles, spawnBossObstacle()],
              lastSpawnTime: now,
            };
          } else {
            updated = {
              ...updated,
              obstacles: [...updated.obstacles, spawnObstacle(difficulty, updated.wave)],
              lastSpawnTime: now,
            };
          }
        }
        
        // Spawn power-ups (every 10-15 seconds)
        const powerUpInterval = POWER_UP_SPAWN_INTERVAL_MIN + Math.random() * POWER_UP_SPAWN_INTERVAL_RANGE;
        if (now - prev.lastPowerUpSpawn > powerUpInterval && prev.powerUps.length < MAX_POWER_UPS) {
          updated = {
            ...updated,
            powerUps: [...updated.powerUps, spawnPowerUp()],
            lastPowerUpSpawn: now,
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
    const score = gameState.score;
    if (score < 500) return "Didn't even try, ser 😅";
    if (score < 1000) return "Paper hands detected 📄";
    if (score < 2000) return "Not bad, but NGMI 😰";
    if (score < 3000) return "Getting there, fren! 💪";
    if (score < 5000) return "Diamond hands forming! 💎";
    return "ABSOLUTE CHAD! WAGMI! 🏆🐔";
  };

  // If embedded, render as full-page like the dashboard
  if (embedded) {
    return (
      <div className="popup-container" style={{ background: 'linear-gradient(180deg, #0b0f17 0%, #0f1923 50%, #0b0f17 100%)' }}>
        {/* Header - matches dashboard header style */}
        <header className="fixed top-0 left-0 right-0 h-14 bg-[#0b0f17]/95 border-b border-[#7ef3c5]/20 z-50 px-4 flex items-center justify-between backdrop-blur-xl">
          <h1 className="text-lg font-bold text-[#7ef3c5]">🎮 CRYPTO SURVIVOR</h1>
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-[#7ef3c5] hover:text-white px-3 py-1.5 rounded-lg bg-[#7ef3c5]/10 hover:bg-[#7ef3c5]/20 transition-colors border border-[#7ef3c5]/30"
          >
            <span>↩</span>
            <span>Dashboard</span>
          </button>
        </header>

        {/* Game content area - matches dashboard content-area */}
        <div className="content-area flex items-center justify-center" onClick={handleToggle}>
          <div className="relative">
            <GameCanvas gameState={gameState} width={360} height={400} />
            
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

        {/* Footer - matches dashboard footer style */}
        <footer className="fixed bottom-0 left-0 right-0 h-14 bg-[#0b0f17]/95 border-t border-[#7ef3c5]/20 px-4 flex items-center justify-center z-50 backdrop-blur-xl">
          <div className="text-sm text-gray-500">
            Space / Click = Toggle Direction | ESC = Back to Dashboard
          </div>
        </footer>
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
