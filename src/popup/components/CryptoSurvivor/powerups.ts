import { PowerUp, ActivePowerUp } from './gameTypes';

const POWER_UP_RADIUS = 120; // Spawn between player and obstacles

export const POWER_UP_CONFIGS = {
  shield: { icon: '🛡️', name: 'Diamond Hands', color: '#4be1a1' },
  slowmo: { icon: '⏱️', name: 'HODL Mode', color: '#ffdd99' },
  mini: { icon: '🔹', name: 'Smol Bean', color: '#7ef3c5' },
  magnet: { icon: '🧲', name: 'Magnet', color: '#ff7bff' },
  double: { icon: '⭐', name: 'Moon Bonus', color: '#ffdd99' },
} as const;

export function spawnPowerUp(): PowerUp {
  const types: Array<'shield' | 'slowmo' | 'mini' | 'magnet' | 'double'> = 
    ['shield', 'slowmo', 'mini', 'magnet', 'double'];
  const type = types[Math.floor(Math.random() * types.length)];
  const config = POWER_UP_CONFIGS[type];
  
  return {
    id: `powerup-${Date.now()}-${Math.random()}`,
    type,
    angle: Math.random() * Math.PI * 2,
    radius: POWER_UP_RADIUS,
    x: 0,
    y: 0,
    collected: false,
    icon: config.icon,
  };
}

export function updatePowerUpPositions(
  powerUps: PowerUp[],
  centerX: number,
  centerY: number
): PowerUp[] {
  return powerUps.map(pu => ({
    ...pu,
    angle: pu.angle + 0.01, // Slowly rotate
    x: centerX + Math.cos(pu.angle) * pu.radius,
    y: centerY + Math.sin(pu.angle) * pu.radius,
  }));
}

export function checkPowerUpCollection(
  playerAngle: number,
  playerRadius: number,
  powerUps: PowerUp[]
): { collected: PowerUp[]; remaining: PowerUp[] } {
  const collected: PowerUp[] = [];
  const remaining: PowerUp[] = [];
  
  powerUps.forEach(pu => {
    if (pu.collected) {
      remaining.push(pu);
      return;
    }
    
    // Check if player is close enough to collect
    const angleDiff = Math.abs(normalizeAngle(playerAngle - pu.angle));
    const radiusDiff = Math.abs(playerRadius - pu.radius);
    
    if (angleDiff < 0.3 && radiusDiff < 30) {
      collected.push({ ...pu, collected: true });
    } else {
      remaining.push(pu);
    }
  });
  
  return { collected, remaining };
}

export function activatePowerUp(
  type: PowerUp['type'],
  currentTime: number
): ActivePowerUp {
  const durations = {
    shield: Infinity, // Until used
    slowmo: 5000,     // 5 seconds
    mini: 5000,       // 5 seconds
    magnet: 5000,     // 5 seconds
    double: 10000,    // 10 seconds
  };
  
  return {
    type,
    endTime: currentTime + durations[type],
    used: type === 'shield' ? false : undefined,
  };
}

export function updateActivePowerUps(
  activePowerUps: ActivePowerUp[],
  currentTime: number
): ActivePowerUp[] {
  return activePowerUps.filter(pu => {
    if (pu.type === 'shield' && !pu.used) return true;
    return pu.endTime > currentTime;
  });
}

export function hasActivePowerUp(
  activePowerUps: ActivePowerUp[],
  type: PowerUp['type']
): boolean {
  return activePowerUps.some(pu => pu.type === type);
}

export function useShield(activePowerUps: ActivePowerUp[]): ActivePowerUp[] {
  return activePowerUps.map(pu => {
    if (pu.type === 'shield' && !pu.used) {
      return { ...pu, used: true };
    }
    return pu;
  }).filter(pu => pu.type !== 'shield' || !pu.used);
}

function normalizeAngle(angle: number): number {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
}

export function drawPowerUps(
  ctx: CanvasRenderingContext2D,
  powerUps: PowerUp[],
  time: number
) {
  powerUps.forEach(pu => {
    if (pu.collected) return;
    
    const config = POWER_UP_CONFIGS[pu.type];
    
    // Pulsing glow
    const pulse = 0.8 + Math.sin(time / 200) * 0.2;
    
    // Draw glow
    ctx.save();
    ctx.globalAlpha = 0.3 * pulse;
    ctx.fillStyle = config.color;
    ctx.beginPath();
    ctx.arc(pu.x, pu.y, 20 * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Draw icon background
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.arc(pu.x, pu.y, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw border
    ctx.strokeStyle = config.color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
    
    // Draw icon (emoji)
    ctx.save();
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(pu.icon, pu.x, pu.y);
    ctx.restore();
  });
}
