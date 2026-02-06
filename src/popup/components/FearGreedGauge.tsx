import React, { useEffect, useState, useMemo } from 'react';
import { FearGreedData } from '../../types';

interface FearGreedGaugeProps {
  fearGreed: FearGreedData;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  angle: number;
}

export const FearGreedGauge: React.FC<FearGreedGaugeProps> = ({ fearGreed }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [pulse, setPulse] = useState(1);
  const [glowIntensity, setGlowIntensity] = useState(0.5);

  // Derive mood from fearGreed state
  const mood = useMemo(() => {
    if (fearGreed.state === 'extreme-greed' || fearGreed.state === 'greed') return 'bullish';
    if (fearGreed.state === 'extreme-fear' || fearGreed.state === 'fear') return 'bearish';
    return 'neutral';
  }, [fearGreed.state]);

  // Animate pulse and glow
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(1 + Math.sin(Date.now() / 500) * 0.1);
      setGlowIntensity(0.5 + Math.sin(Date.now() / 300) * 0.3);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      const count = mood === 'neutral' ? 5 : 12;
      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 2 + Math.random() * 4,
          speed: 0.5 + Math.random() * 1.5,
          opacity: 0.3 + Math.random() * 0.7,
          angle: Math.random() * Math.PI * 2,
        });
      }
      setParticles(newParticles);
    };
    generateParticles();
  }, [mood]);

  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        y: mood === 'bullish' 
          ? (p.y - p.speed + 100) % 100 
          : mood === 'bearish'
          ? (p.y + p.speed) % 100
          : p.y + Math.sin(Date.now() / 1000 + p.angle) * 0.3,
        x: p.x + Math.sin(Date.now() / 2000 + p.angle) * 0.2,
        opacity: 0.3 + Math.abs(Math.sin(Date.now() / 1000 + p.id)) * 0.7,
      })));
    }, 50);
    return () => clearInterval(interval);
  }, [mood]);

  const getMoodEmoji = () => {
    switch (fearGreed.state) {
      case 'extreme-greed': return '🚀';
      case 'greed': return '🔥';
      case 'fear': return '😰';
      case 'extreme-fear': return '💀';
      default: return '😐';
    }
  };

  const getMoodText = () => {
    switch (fearGreed.state) {
      case 'extreme-greed': return 'EXTREME GREED';
      case 'greed': return 'GREED';
      case 'fear': return 'FEAR';
      case 'extreme-fear': return 'EXTREME FEAR';
      default: return 'NEUTRAL';
    }
  };

  const colors = useMemo(() => {
    if (mood === 'bullish') {
      return {
        primary: '#14f195',
        secondary: '#7ef3c5',
        glow: 'rgba(20, 241, 149, 0.4)',
        gradient: 'from-green-500/20 via-emerald-500/10 to-transparent',
        particle: '#14f195',
        bg: 'rgba(20, 241, 149, 0.05)',
      };
    } else if (mood === 'bearish') {
      return {
        primary: '#ff6b6b',
        secondary: '#ff9999',
        glow: 'rgba(255, 107, 107, 0.4)',
        gradient: 'from-red-500/20 via-rose-500/10 to-transparent',
        particle: '#ff6b6b',
        bg: 'rgba(255, 107, 107, 0.05)',
      };
    }
    return {
      primary: '#9ca3af',
      secondary: '#6b7280',
      glow: 'rgba(156, 163, 175, 0.3)',
      gradient: 'from-gray-500/20 via-gray-500/10 to-transparent',
      particle: '#9ca3af',
      bg: 'rgba(156, 163, 175, 0.05)',
    };
  }, [mood]);

  return (
    <div 
      className="relative rounded-xl p-4 mb-4 overflow-hidden transition-all duration-500"
      style={{ 
        background: `linear-gradient(135deg, ${colors.bg} 0%, rgba(15, 15, 26, 0.9) 100%)`,
        boxShadow: `0 0 ${20 * glowIntensity}px ${colors.glow}`,
      }}
    >
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full transition-opacity duration-300"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              backgroundColor: colors.particle,
              opacity: p.opacity * 0.6,
              boxShadow: `0 0 ${p.size * 2}px ${colors.particle}`,
            }}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} pointer-events-none`} />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-[#ab9ff2]/60 uppercase tracking-wider">
            Market Mood
          </span>
          <div 
            className="text-2xl transition-transform duration-300"
            style={{ transform: `scale(${pulse})` }}
          >
            {getMoodEmoji()}
          </div>
        </div>

        {/* Main mood display */}
        <div className="flex items-center gap-3 mb-3">
          <div 
            className="text-xl font-bold tracking-tight transition-all duration-500"
            style={{ 
              color: colors.primary,
              textShadow: `0 0 ${10 * glowIntensity}px ${colors.glow}`,
            }}
          >
            {getMoodText()}
          </div>
          <div 
            className="text-sm font-mono px-2 py-0.5 rounded"
            style={{ 
              backgroundColor: colors.bg,
              color: colors.secondary,
            }}
          >
            {fearGreed.score}/100
          </div>
        </div>

        {/* Animated mood bar */}
        <div className="relative h-3 rounded-full overflow-hidden bg-[#2a2a4a]/50">
          {/* Background segments */}
          <div className="absolute inset-0 flex">
            <div className="flex-1 bg-gradient-to-r from-red-500/20 to-red-500/10" />
            <div className="flex-1 bg-gradient-to-r from-yellow-500/10 to-yellow-500/10" />
            <div className="flex-1 bg-gradient-to-r from-green-500/10 to-green-500/20" />
          </div>
          
          {/* Full gradient bar */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, #ff6b6b 0%, #fbbf24 50%, #14f195 100%)',
              opacity: 0.8,
            }}
          />
          
          {/* Indicator needle */}
          <div 
            className="absolute top-0 bottom-0 w-1 transition-all duration-1000 ease-out"
            style={{
              left: `calc(${fearGreed.score}% - 2px)`,
              backgroundColor: '#fff',
              boxShadow: `0 0 8px #fff, 0 0 15px ${colors.primary}`,
            }}
          />
        </div>

        {/* Scale labels */}
        <div className="flex justify-between mt-1.5 text-[10px] text-gray-500">
          <span>FEAR</span>
          <span>NEUTRAL</span>
          <span>GREED</span>
        </div>
      </div>
    </div>
  );
};
