import { Obstacle } from './gameTypes';

const OBSTACLE_COLORS = ['#ff7b7b', '#ffdd99', '#4be1a1'];

export function spawnObstacle(difficulty: number): Obstacle {
  return {
    id: `obs-${Date.now()}-${Math.random()}`,
    angle: Math.random() * Math.PI * 2,
    span: 0.4 + Math.random() * 1.1, // 0.4 to 1.5 radians
    radius: 160 + Math.random() * 20,
    startRadius: 170,
    radialSpeed: 1 + difficulty * 0.5 + Math.random() * 1.5,
    spin: (Math.random() - 0.5) * 0.04,
    thickness: 14 + Math.random() * 10,
    color: OBSTACLE_COLORS[Math.floor(Math.random() * OBSTACLE_COLORS.length)],
  };
}

// Spawn interval decreases with time (harder over time)
export function getSpawnInterval(elapsedSeconds: number): number {
  const baseInterval = 1500; // ms
  const minInterval = 600;   // ms
  return Math.max(minInterval, baseInterval - elapsedSeconds * 20);
}
