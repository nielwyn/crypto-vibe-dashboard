import { GameState, Obstacle } from './gameTypes';

const PLAYER_RADIUS = 80;
const PLAYER_SPEED = 0.05; // radians per frame

export function updateGame(state: GameState): GameState {
  if (state.status !== 'playing') return state;
  
  // Update player position
  const newAngle = state.playerAngle + (PLAYER_SPEED * state.playerDirection);
  
  // Update obstacles (move inward, apply spin)
  const updatedObstacles = state.obstacles
    .map(obs => ({
      ...obs,
      radius: obs.radius - obs.radialSpeed,
      angle: obs.angle + obs.spin,
    }))
    .filter(obs => obs.radius > 20); // Remove obstacles that reached center
  
  // Check collisions
  const collision = checkCollision(newAngle, updatedObstacles);
  
  if (collision) {
    return {
      ...state,
      status: 'gameover',
      highScore: Math.max(state.score, state.highScore),
    };
  }
  
  // Update score (based on time survived)
  const elapsed = (Date.now() - state.startTime) / 1000;
  const newScore = Math.floor(elapsed * 100);
  
  return {
    ...state,
    playerAngle: newAngle,
    obstacles: updatedObstacles,
    score: newScore,
  };
}

function checkCollision(playerAngle: number, obstacles: Obstacle[]): boolean {
  for (const obs of obstacles) {
    // Check if player is within obstacle's radial zone
    const radiusDiff = Math.abs(obs.radius - PLAYER_RADIUS);
    if (radiusDiff > obs.thickness / 2 + 5) continue; // 5px buffer
    
    // Check if player angle is within obstacle's arc
    let angleDiff = normalizeAngle(playerAngle - obs.angle);
    if (Math.abs(angleDiff) < obs.span / 2 + 0.1) { // 0.1 rad buffer
      return true;
    }
  }
  return false;
}

function normalizeAngle(angle: number): number {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
}
