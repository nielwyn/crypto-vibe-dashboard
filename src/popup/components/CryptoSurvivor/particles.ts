import { Particle } from './gameTypes';

export function createTrailParticle(x: number, y: number): Particle {
  const angle = Math.random() * Math.PI * 2;
  const speed = 0.5 + Math.random() * 1;
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    life: 30,
    maxLife: 30,
    color: '#7ef3c5',
    size: 2 + Math.random() * 3,
    alpha: 1,
  };
}

export function createExplosionParticles(x: number, y: number, count: number = 20): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const speed = 2 + Math.random() * 3;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 40,
      maxLife: 40,
      color: ['#ff7b7b', '#ffdd99', '#7ef3c5'][Math.floor(Math.random() * 3)],
      size: 3 + Math.random() * 4,
      alpha: 1,
    });
  }
  return particles;
}

export function createCollectParticles(x: number, y: number, color: string, count: number = 15): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 2;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 30,
      maxLife: 30,
      color,
      size: 2 + Math.random() * 3,
      alpha: 1,
    });
  }
  return particles;
}

export function createStarParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: 0,
    vy: 0.2 + Math.random() * 0.3,
    life: 200,
    maxLife: 200,
    color: '#ffffff',
    size: 1 + Math.random() * 2,
    alpha: 0.3 + Math.random() * 0.4,
  };
}

export function updateParticles(particles: Particle[]): Particle[] {
  return particles
    .map(p => ({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      life: p.life - 1,
      alpha: p.life / p.maxLife,
    }))
    .filter(p => p.life > 0);
}

export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}
