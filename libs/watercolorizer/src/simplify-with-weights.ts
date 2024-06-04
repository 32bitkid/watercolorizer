import { SimplifyAP as simplify } from 'simplify-ts';

import { Vec2 } from '@4bitlabs/vec2';
import { PointsAndWeights } from './types';

export const warnOnce = <T>(message: string, defaultVal: T) => {
  let warned = false;
  return (val: T = defaultVal): T => {
    if (!warned) {
      console.warn(message);
      warned = true;
    }
    return val;
  };
};

const fallback = warnOnce<number>('cache hit missed: using fallback value', 1);

export const simplifyWithWeights = (
  [points, weights]: PointsAndWeights,
  tolerance: number,
): PointsAndWeights => {
  // Cache existing vertex weights
  const cache = new WeakMap<Vec2, number>(
    points.map((vec, idx) => [vec, weights[idx]]),
  );

  const loop = [...points, points[0]]; // close the loop
  const simplified = simplify(loop, tolerance);
  const nextPoints = simplified.slice(0, -1); // open the loop

  // Rebuild weights on reduced set
  const nextWeights = nextPoints.map((it) => cache.get(it) ?? fallback());
  return [nextPoints, nextWeights];
};
