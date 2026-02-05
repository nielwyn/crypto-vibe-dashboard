import React, { useRef, useEffect } from 'react';
import { GameState } from './gameTypes';

interface GameCanvasProps {
  gameState: GameState;
  width: number;
  height: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const CENTER_X = width / 2;
  const CENTER_Y = height / 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0b0f17';
    ctx.fillRect(0, 0, width, height);

    // Draw center glow
    const gradient = ctx.createRadialGradient(CENTER_X, CENTER_Y, 0, CENTER_X, CENTER_Y, 100);
    gradient.addColorStop(0, 'rgba(126, 243, 197, 0.1)');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw obstacles (arcs)
    gameState.obstacles.forEach(obs => {
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
      ctx.stroke();
    });

    // Draw player (triangle)
    const playerX = CENTER_X + Math.cos(gameState.playerAngle) * 80;
    const playerY = CENTER_Y + Math.sin(gameState.playerAngle) * 80;
    
    ctx.save();
    ctx.translate(playerX, playerY);
    ctx.rotate(gameState.playerAngle + Math.PI / 2);
    
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(-8, 8);
    ctx.lineTo(8, 8);
    ctx.closePath();
    
    ctx.fillStyle = '#7ef3c5';
    ctx.shadowColor = '#7ef3c5';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();

    // Draw orbit circle (faint)
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, 80, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(126, 243, 197, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

  }, [gameState, width, height, CENTER_X, CENTER_Y]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};
