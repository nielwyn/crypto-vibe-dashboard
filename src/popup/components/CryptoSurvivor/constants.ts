// Game timing constants
export const COMBO_TIMEOUT = 3000; // ms - time window to maintain combo
export const POWER_UP_SPAWN_INTERVAL_MIN = 10000; // ms
export const POWER_UP_SPAWN_INTERVAL_RANGE = 5000; // ms
export const MAX_POWER_UPS = 3;

// Spawn interval constants
export const BASE_SPAWN_INTERVAL = 1500; // ms
export const MIN_SPAWN_INTERVAL = 500; // ms
export const WAVE_DIFFICULTY_MULTIPLIER = 0.1;
export const TIME_DIFFICULTY_MULTIPLIER = 15; // ms reduction per second

// Near-miss detection
export const NEAR_MISS_MIN_DISTANCE = -20; // pixels
export const NEAR_MISS_MAX_DISTANCE = -30; // pixels
export const NEAR_MISS_BONUS = 50; // points

// Power-up durations (ms)
export const POWER_UP_DURATIONS = {
  shield: Number.MAX_SAFE_INTEGER, // Effectively infinite, but avoids Infinity arithmetic issues
  slowmo: 5000,
  mini: 10000, // 10 seconds
  magnet: 5000,
  double: 10000,
} as const;
