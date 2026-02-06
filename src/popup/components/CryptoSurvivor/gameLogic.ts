import { GameState, Obstacle } from './gameTypes';
import { updateParticles, createTrailParticle, createExplosionParticles, createCollectParticles, createStarParticle } from './particles';
import { updatePowerUpPositions, checkPowerUpCollection, activatePowerUp, updateActivePowerUps, hasActivePowerUp, useShield } from './powerups';
import { COMBO_TIMEOUT, NEAR_MISS_MIN_DISTANCE, NEAR_MISS_MAX_DISTANCE, NEAR_MISS_BONUS } from './constants';

const PLAYER_RADIUS = 80;
const PLAYER_SPEED = 0.05; // radians per frame

export function updateGame(state: GameState, centerX: number, centerY: number, width: number, height: number): GameState {
  if (state.status !== 'playing') return state;
  
  const currentTime = Date.now();
  const elapsed = (currentTime - state.startTime) / 1000;
  
  // Apply slow-mo effect
  const slowMoActive = hasActivePowerUp(state.activePowerUps, 'slowmo');
  const speedMultiplier = slowMoActive ? 0.5 : 1;
  
  // Apply mini effect
  const miniActive = hasActivePowerUp(state.activePowerUps, 'mini');
  const playerSize = miniActive ? 0.7 : 1;
  
  // Update player position
  const newAngle = state.playerAngle + (PLAYER_SPEED * state.playerDirection);
  
  // Update obstacles (move inward, apply spin)
  const updatedObstacles = state.obstacles
    .map(obs => ({
      ...obs,
      radius: obs.radius - obs.radialSpeed * speedMultiplier,
      angle: obs.angle + obs.spin,
    }))
    .filter(obs => obs.radius > 20); // Remove obstacles that reached center
  
  // Update particles
  let updatedParticles = updateParticles(state.particles);
  
  // Add trail particles
  const playerX = centerX + Math.cos(newAngle) * PLAYER_RADIUS;
  const playerY = centerY + Math.sin(newAngle) * PLAYER_RADIUS;
  if (Math.random() < 0.3) {
    updatedParticles.push(createTrailParticle(playerX, playerY));
  }
  
  // Add background stars
  if (updatedParticles.filter(p => p.color === '#ffffff').length < 20) {
    updatedParticles.push(createStarParticle(width, height));
  }
  
  // Update power-ups
  let updatedPowerUps = updatePowerUpPositions(state.powerUps, centerX, centerY);
  const { collected, remaining } = checkPowerUpCollection(newAngle, PLAYER_RADIUS, updatedPowerUps);
  
  // Activate collected power-ups
  let updatedActivePowerUps = [...state.activePowerUps];
  let updatedScorePopups = [...state.scorePopups];
  
  collected.forEach(pu => {
    updatedActivePowerUps.push(activatePowerUp(pu.type, currentTime));
    updatedParticles.push(...createCollectParticles(pu.x, pu.y, '#7ef3c5'));
    updatedScorePopups.push({
      id: `popup-${Date.now()}-${Math.random()}`,
      text: `${pu.icon} ${pu.type.toUpperCase()}!`,
      x: pu.x,
      y: pu.y,
      life: 60,
      maxLife: 60,
      color: '#7ef3c5',
    });
  });
  
  updatedPowerUps = remaining;
  updatedActivePowerUps = updateActivePowerUps(updatedActivePowerUps, currentTime);
  
  // Check near-misses
  const { nearMiss, nearMissBonus } = checkNearMiss(newAngle, updatedObstacles);
  let combo = state.combo;
  let screenShake = state.screenShake;
  
  if (nearMiss) {
    // Increment combo if within timeout
    if (currentTime - state.lastNearMissTime < COMBO_TIMEOUT) {
      combo = state.combo + 1;
    } else {
      combo = 1;
    }
    
    screenShake = 5;
    
    // Add near-miss score popup
    const bonusScore = nearMissBonus * combo;
    updatedScorePopups.push({
      id: `popup-${Date.now()}-${Math.random()}`,
      text: `+${bonusScore} NEAR MISS! ${combo > 1 ? `${combo}x COMBO!` : ''}`,
      x: playerX,
      y: playerY - 30,
      life: 60,
      maxLife: 60,
      color: '#ffdd99',
    });
  } else if (currentTime - state.lastNearMissTime > COMBO_TIMEOUT) {
    combo = 0;
  }
  
  // Check collisions
  const collision = checkCollision(newAngle, updatedObstacles, playerSize);
  
  if (collision) {
    // Check for shield
    if (hasActivePowerUp(updatedActivePowerUps, 'shield')) {
      updatedActivePowerUps = useShield(updatedActivePowerUps);
      screenShake = 10;
      updatedScorePopups.push({
        id: `popup-${Date.now()}-${Math.random()}`,
        text: '🛡️ SHIELD BROKEN!',
        x: playerX,
        y: playerY,
        life: 60,
        maxLife: 60,
        color: '#ff7b7b',
      });
    } else {
      // Game over - explosion
      updatedParticles.push(...createExplosionParticles(playerX, playerY, 30));
      return {
        ...state,
        status: 'gameover',
        highScore: Math.max(state.score, state.highScore),
        particles: updatedParticles,
        screenShake: 15,
      };
    }
  }
  
  // Update score (based on time survived + bonuses)
  const doubleActive = hasActivePowerUp(state.activePowerUps, 'double');
  const scoreMultiplier = doubleActive ? 2 : 1;
  let newScore = Math.floor(elapsed * 100 * scoreMultiplier);
  
  // Add near-miss bonus
  if (nearMiss) {
    newScore += nearMissBonus * combo;
  }
  
  // Update score popups
  updatedScorePopups = updatedScorePopups
    .map(sp => ({
      ...sp,
      life: sp.life - 1,
      y: sp.y - 0.5,
    }))
    .filter(sp => sp.life > 0);
  
  // Calculate current wave
  const wave = Math.floor(elapsed / 15) + 1;
  
  // Decay screen shake
  screenShake = Math.max(0, screenShake - 0.5);
  
  return {
    ...state,
    playerAngle: newAngle,
    obstacles: updatedObstacles,
    particles: updatedParticles,
    powerUps: updatedPowerUps,
    activePowerUps: updatedActivePowerUps,
    scorePopups: updatedScorePopups,
    score: newScore,
    wave,
    combo,
    lastNearMissTime: nearMiss ? currentTime : state.lastNearMissTime,
    screenShake,
  };
}

function checkCollision(playerAngle: number, obstacles: Obstacle[], sizeMultiplier: number = 1): boolean {
  for (const obs of obstacles) {
    // Check if player is within obstacle's radial zone
    const radiusDiff = Math.abs(obs.radius - PLAYER_RADIUS);
    const buffer = 5 * sizeMultiplier;
    if (radiusDiff > obs.thickness / 2 + buffer) continue;
    
    // Check if player angle is within obstacle's arc
    let angleDiff = normalizeAngle(playerAngle - obs.angle);
    const angleBuffer = 0.1 * sizeMultiplier;
    if (Math.abs(angleDiff) < obs.span / 2 + angleBuffer) {
      return true;
    }
  }
  return false;
}

function checkNearMiss(playerAngle: number, obstacles: Obstacle[]): { nearMiss: boolean; nearMissBonus: number } {
  let nearMiss = false;
  let nearMissBonus = 0;
  
  for (const obs of obstacles) {
    // Check if obstacle just passed the player
    const radiusDiff = obs.radius - PLAYER_RADIUS;
    // radiusDiff goes from 0 to negative as obstacle passes inward
    // NEAR_MISS_MAX_DISTANCE is -30, NEAR_MISS_MIN_DISTANCE is -20
    if (radiusDiff > NEAR_MISS_MAX_DISTANCE && radiusDiff < NEAR_MISS_MIN_DISTANCE) {
      // Check if it was close in angle
      let angleDiff = normalizeAngle(playerAngle - obs.angle);
      if (Math.abs(angleDiff) < obs.span / 2 + 0.3) {
        nearMiss = true;
        nearMissBonus = NEAR_MISS_BONUS;
        break;
      }
    }
  }
  
  return { nearMiss, nearMissBonus };
}

function normalizeAngle(angle: number): number {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
}
