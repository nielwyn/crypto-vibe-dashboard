export interface Obstacle {
  id: string;
  angle: number;           // center angle in radians
  span: number;            // arc width in radians (0.4 to 1.5)
  radius: number;          // current radius from center
  startRadius: number;     // initial spawn radius (160-180)
  radialSpeed: number;     // inward speed px/frame (1-3)
  spin: number;            // rotation speed rad/frame (-0.02 to 0.02)
  thickness: number;       // arc thickness (14-24px)
  color: string;           // hex color
}

export interface GameState {
  status: 'start' | 'playing' | 'gameover';
  score: number;
  highScore: number;
  playerAngle: number;
  playerDirection: 1 | -1;  // 1 = clockwise, -1 = counter-clockwise
  obstacles: Obstacle[];
  startTime: number;
  lastSpawnTime: number;
}
