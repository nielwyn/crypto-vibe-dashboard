import { Obstacle } from './gameTypes';
import { BASE_SPAWN_INTERVAL, MIN_SPAWN_INTERVAL, WAVE_DIFFICULTY_MULTIPLIER, TIME_DIFFICULTY_MULTIPLIER } from './constants';

const OBSTACLE_COLORS = ['#ff7b7b', '#ffdd99', '#4be1a1'];

export function spawnObstacle(difficulty: number, wave: number): Obstacle {
  // Determine obstacle type based on wave
  let type: Obstacle['type'] = 'normal';
  const rand = Math.random();
  
  if (wave >= 3 && rand < 0.2) {
    type = 'fast';
  } else if (wave >= 4 && rand < 0.15) {
    type = 'wide';
  }
  
  let span = 0.4 + Math.random() * 1.1; // 0.4 to 1.5 radians
  let radialSpeed = 1 + difficulty * 0.5 + Math.random() * 1.5;
  let thickness = 3 + Math.random() * 3; // Very thin obstacles (3-6px)
  
  // Adjust based on type
  if (type === 'fast') {
    radialSpeed *= 1.5;
    thickness *= 0.8;
    span *= 0.8;
  } else if (type === 'wide') {
    span *= 1.5;
    thickness *= 1.3;
    radialSpeed *= 0.9;
  }
  
  return {
    id: `obs-${Date.now()}-${Math.random()}`,
    angle: Math.random() * Math.PI * 2,
    span,
    radius: 350 + Math.random() * 50, // Spawn at edge of screen
    startRadius: 380,
    radialSpeed,
    spin: (Math.random() - 0.5) * 0.04 * (wave >= 2 ? 1.5 : 1),
    thickness,
    color: OBSTACLE_COLORS[Math.floor(Math.random() * OBSTACLE_COLORS.length)],
    type,
  };
}

export function spawnBossObstacle(): Obstacle {
  return {
    id: `boss-${Date.now()}`,
    angle: Math.random() * Math.PI * 2,
    span: Math.PI, // 180 degrees - half circle
    radius: 380, // Spawn at edge
    startRadius: 380,
    radialSpeed: 0.8,
    spin: 0, // No rotation for boss
    thickness: 6, // Thinner boss obstacle
    color: '#ff4444',
    type: 'boss',
  };
}

// Spawn interval decreases with wave
export function getSpawnInterval(elapsedSeconds: number, wave: number): number {
  const waveMultiplier = Math.max(0.5, 1 - (wave - 1) * WAVE_DIFFICULTY_MULTIPLIER);
  return Math.max(MIN_SPAWN_INTERVAL, BASE_SPAWN_INTERVAL * waveMultiplier - elapsedSeconds * TIME_DIFFICULTY_MULTIPLIER);
}

export function getObstacleGlow(obstacle: Obstacle, time: number): number {
  const pulse = 0.7 + Math.sin(time / 300) * 0.3;
  if (obstacle.type === 'boss') return pulse * 1.5;
  if (obstacle.type === 'fast') return pulse * 1.2;
  return pulse;
}

export const OBSTACLE_NAMES = {
  normal: 'FUD Wave',
  fast: 'Bear Attack',
  wide: 'Rug Pull',
  boss: 'SEC Subpoena',
} as const;
