export const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;

export const clamp = (min: number, max: number, v: number) =>
  Math.max(Math.min(max, v), min);
