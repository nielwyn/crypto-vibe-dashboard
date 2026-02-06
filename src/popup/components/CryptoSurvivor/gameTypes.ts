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
  type?: 'normal' | 'fast' | 'wide' | 'boss';  // obstacle type
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  alpha: number;
}

export interface PowerUp {
  id: string;
  type: 'shield' | 'slowmo' | 'mini' | 'magnet' | 'double';
  x: number;
  y: number;
  angle: number;
  radius: number;
  collected: boolean;
  icon: string;
}

export interface ActivePowerUp {
  type: 'shield' | 'slowmo' | 'mini' | 'magnet' | 'double';
  endTime: number;
  used?: boolean; // for shield
}

export interface ScorePopup {
  id: string;
  text: string;
  x: number;
  y: number;
  life: number;
  maxLife: number;
  color: string;
}

export interface GameState {
  status: 'start' | 'playing' | 'gameover';
  score: number;
  highScore: number;
  playerAngle: number;
  targetAngle: number;  // Mouse-controlled target angle
  playerDirection: 1 | -1;  // 1 = clockwise, -1 = counter-clockwise
  obstacles: Obstacle[];
  startTime: number;
  lastSpawnTime: number;
  particles: Particle[];
  powerUps: PowerUp[];
  activePowerUps: ActivePowerUp[];
  scorePopups: ScorePopup[];
  wave: number;
  combo: number;
  lastNearMissTime: number;
  screenShake: number;
  lastPowerUpSpawn: number;
}
