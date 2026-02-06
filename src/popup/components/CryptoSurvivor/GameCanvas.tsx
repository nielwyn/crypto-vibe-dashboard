import React, { useRef, useEffect, useState } from 'react';
import { GameState } from './gameTypes';
import { drawParticles } from './particles';
import { drawPowerUps, POWER_UP_CONFIGS } from './powerups';
import { getObstacleGlow } from './obstacles';

interface GameCanvasProps {
  gameState: GameState;
  width: number;
  height: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chickenImg] = useState(() => {
    const img = new Image();
    // Check if running as Chrome extension
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
      img.src = chrome.runtime.getURL('assets/chicken.svg');
    } else {
      // Development mode - use relative path
      img.src = '/assets/chicken.svg';
    }
    return img;
  });
  const [time, setTime] = useState(0);
  
  const CENTER_X = width / 2;
  const CENTER_Y = height / 2;

  useEffect(() => {
    const timer = setInterval(() => setTime(t => t + 16), 16);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Apply screen shake
    ctx.save();
    if (gameState.screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * gameState.screenShake;
      const shakeY = (Math.random() - 0.5) * gameState.screenShake;
      ctx.translate(shakeX, shakeY);
    }

    // Clear canvas
    ctx.fillStyle = '#0b0f17';
    ctx.fillRect(0, 0, width, height);

    // Draw animated background grid
    ctx.save();
    ctx.strokeStyle = 'rgba(126, 243, 197, 0.05)';
    ctx.lineWidth = 1;
    const gridRotation = time / 5000;
    ctx.translate(CENTER_X, CENTER_Y);
    ctx.rotate(gridRotation);
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.arc(0, 0, 40 + i * 20, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    // Draw background particles (stars)
    drawParticles(ctx, gameState.particles.filter(p => p.color === '#ffffff'));

    // Draw center glow (pulsing with game intensity)
    const intensity = 0.1 + Math.min(gameState.wave * 0.02, 0.15);
    const pulse = 0.8 + Math.sin(time / 400) * 0.2;
    const gradient = ctx.createRadialGradient(CENTER_X, CENTER_Y, 0, CENTER_X, CENTER_Y, 100 * pulse);
    gradient.addColorStop(0, `rgba(126, 243, 197, ${intensity * pulse})`);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw danger zone indicator (red glow when obstacles near)
    const nearObstacles = gameState.obstacles.filter(obs => obs.radius < 100);
    if (nearObstacles.length > 0) {
      const dangerGradient = ctx.createRadialGradient(CENTER_X, CENTER_Y, 60, CENTER_X, CENTER_Y, 120);
      dangerGradient.addColorStop(0, 'transparent');
      dangerGradient.addColorStop(1, 'rgba(255, 123, 123, 0.1)');
      ctx.fillStyle = dangerGradient;
      ctx.fillRect(0, 0, width, height);
    }

    // Draw obstacles with enhanced visuals
    gameState.obstacles.forEach(obs => {
      const glow = getObstacleGlow(obs, time);
      
      // Draw glow effect
      ctx.save();
      ctx.globalAlpha = 0.3 * glow;
      ctx.beginPath();
      ctx.arc(
        CENTER_X, CENTER_Y,
        obs.radius,
        obs.angle - obs.span / 2,
        obs.angle + obs.span / 2
      );
      ctx.strokeStyle = obs.color;
      ctx.lineWidth = obs.thickness + 8;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore();
      
      // Draw main obstacle
      ctx.beginPath();
      ctx.arc(
        CENTER_X, CENTER_Y,
        obs.radius,
        obs.angle - obs.span / 2,
        obs.angle + obs.span / 2
      );
      ctx.strokeStyle = obs.color;
      ctx.lineWidth = obs.thickness;
      ctx.lineCap = 'round';
      ctx.shadowColor = obs.color;
      ctx.shadowBlur = obs.type === 'boss' ? 20 : 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      // Draw boss obstacle gaps
      if (obs.type === 'boss') {
        // Add two gaps in the boss obstacle
        const gap1Angle = obs.angle - obs.span / 3;
        const gap2Angle = obs.angle + obs.span / 3;
        const gapSize = 0.15;
        
        [gap1Angle, gap2Angle].forEach(gapAngle => {
          ctx.beginPath();
          ctx.arc(
            CENTER_X, CENTER_Y,
            obs.radius,
            gapAngle - gapSize,
            gapAngle + gapSize
          );
          ctx.strokeStyle = '#0b0f17';
          ctx.lineWidth = obs.thickness + 4;
          ctx.lineCap = 'round';
          ctx.stroke();
        });
      }
    });

    // Draw power-ups
    drawPowerUps(ctx, gameState.powerUps, time);

    // Draw orbit circle (faint)
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, 80, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(126, 243, 197, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw trail particles
    drawParticles(ctx, gameState.particles.filter(p => p.color !== '#ffffff'));

    // Draw player (chicken)
    const playerX = CENTER_X + Math.cos(gameState.playerAngle) * 80;
    const playerY = CENTER_Y + Math.sin(gameState.playerAngle) * 80;
    
    // Player glow effects based on power-ups
    const hasShield = gameState.activePowerUps.some(pu => pu.type === 'shield');
    const hasMini = gameState.activePowerUps.some(pu => pu.type === 'mini');
    const hasDouble = gameState.activePowerUps.some(pu => pu.type === 'double');
    
    if (hasShield || hasMini || hasDouble) {
      ctx.save();
      ctx.globalAlpha = 0.4;
      const glowColor = hasShield ? '#4be1a1' : hasMini ? '#7ef3c5' : '#ffdd99';
      const glowGradient = ctx.createRadialGradient(playerX, playerY, 0, playerX, playerY, 25);
      glowGradient.addColorStop(0, glowColor);
      glowGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(playerX, playerY, 25 * (0.9 + Math.sin(time / 200) * 0.1), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    
    ctx.save();
    ctx.translate(playerX, playerY);
    ctx.rotate(gameState.playerAngle + Math.PI / 2);
    
    // Scale for mini power-up
    const scale = hasMini ? 0.7 : 1;
    
    // Add bounce effect on direction change
    const bounceScale = 1 + Math.abs(Math.sin(time / 100)) * 0.05;
    ctx.scale(scale * bounceScale, scale * bounceScale);
    
    if (chickenImg.complete) {
      ctx.drawImage(chickenImg, -20, -20, 40, 40);
    } else {
      // Fallback triangle while image loads
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(-8, 8);
      ctx.lineTo(8, 8);
      ctx.closePath();
      ctx.fillStyle = '#7ef3c5';
      ctx.shadowColor = '#7ef3c5';
      ctx.shadowBlur = 10;
      ctx.fill();
    }
    ctx.restore();

    // Draw score popups
    gameState.scorePopups.forEach(sp => {
      ctx.save();
      ctx.globalAlpha = sp.life / sp.maxLife;
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = sp.color;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.textAlign = 'center';
      ctx.strokeText(sp.text, sp.x, sp.y);
      ctx.fillText(sp.text, sp.x, sp.y);
      ctx.restore();
    });

    // Draw HUD overlay
    drawHUD(ctx, gameState, width, height, time);

    ctx.restore();

  }, [gameState, width, height, CENTER_X, CENTER_Y, chickenImg, time]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

function drawHUD(ctx: CanvasRenderingContext2D, gameState: GameState, width: number, height: number, time: number) {
  if (gameState.status !== 'playing') return;

  // Top bar with wave and combo
  ctx.save();
  ctx.fillStyle = 'rgba(11, 15, 23, 0.8)';
  ctx.fillRect(0, 0, width, 50);
  
  // Wave indicator
  ctx.font = 'bold 12px Arial';
  ctx.fillStyle = '#7ef3c5';
  ctx.textAlign = 'left';
  ctx.fillText(`🐔 WAVE ${gameState.wave}`, 10, 25);
  
  // Combo indicator
  if (gameState.combo > 1) {
    const comboColor = gameState.combo > 3 ? '#ffdd99' : '#7ef3c5';
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = comboColor;
    ctx.textAlign = 'right';
    const pulse = 1 + Math.sin(time / 150) * 0.1;
    ctx.save();
    ctx.translate(width - 60, 25);
    ctx.scale(pulse, pulse);
    ctx.fillText(`⭐ ${gameState.combo}x COMBO`, 0, 0);
    ctx.restore();
  }
  ctx.restore();

  // Active power-ups display (bottom)
  const activePowerUps = gameState.activePowerUps;
  if (activePowerUps.length > 0) {
    ctx.save();
    const barHeight = 35;
    ctx.fillStyle = 'rgba(11, 15, 23, 0.8)';
    ctx.fillRect(0, height - barHeight, width, barHeight);
    
    let xOffset = 10;
    activePowerUps.forEach(apu => {
      const config = POWER_UP_CONFIGS[apu.type];
      const remaining = apu.type === 'shield' ? 
        '∞' : 
        Math.ceil((apu.endTime - Date.now()) / 1000) + 's';
      
      // Draw icon and timer
      ctx.font = '16px Arial';
      ctx.fillText(config.icon, xOffset, height - barHeight / 2 + 6);
      
      ctx.font = 'bold 10px Arial';
      ctx.fillStyle = config.color;
      ctx.textAlign = 'left';
      ctx.fillText(remaining.toString(), xOffset + 20, height - barHeight / 2 + 4);
      
      xOffset += 60;
    });
    ctx.restore();
  }

  // Screen border effects
  const borderColor = gameState.combo > 1 ? 
    'rgba(126, 243, 197, 0.3)' : // Green for combo
    gameState.activePowerUps.some(pu => pu.type === 'double') ?
    'rgba(255, 221, 153, 0.3)' : // Gold for 2x score
    null;
  
  if (borderColor) {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, width - 4, height - 4);
  }
}
