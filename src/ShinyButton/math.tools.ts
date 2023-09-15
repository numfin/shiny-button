export interface Dot {
  x: number;
  y: number;
}

export function distance(dot1: Dot, dot2: Dot) {
  const x = (dot1.x - dot2.x) ** 2;
  const y = (dot1.y - dot2.y) ** 2;
  return Math.sqrt(x + y);
}

export function lerp(start: number, end: number, amount: number) {
  return (1 - amount) * start + amount * end;
}

export function clamp(v: number, min: number, max: number) {
  return Math.max(Math.min(v, max), min);
}
