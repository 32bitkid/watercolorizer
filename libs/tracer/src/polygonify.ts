import { Vec2, distanceBetween, add as vecAdd, project } from '@4bitlabs/vec2';

import { Direction, UP, DOWN, LEFT, RIGHT } from './direction';
import { Ring } from './ring';

function distanceToLine(p: Vec2, q: Vec2, a: Vec2): number {
  const proj = project(p, q, a);
  return distanceBetween(a, proj);
}

const pixelCenter: { [key in Direction]: Vec2 } = {
  [DOWN]: [0.5, -0.5],
  [UP]: [-0.5, 0.5],
  [LEFT]: [-0.5, -0.5],
  [RIGHT]: [0.5, 0.5],
};

function possibleRunLength(steps: Direction[], start: number, max: number) {
  let i = 0;
  const dirs = new Set<Direction>();
  do {
    dirs.add(steps[start + i]);
    if (dirs.size > 3) break;
    i += 1;
  } while (i < max);

  return i;
}

const SQRT1_2 = Math.SQRT1_2 ?? Math.sqrt(0.5);

export function polygonify(ring: Ring, steps: Direction[]) {
  if (ring.length < 3) return ring;

  const result: Vec2[] = [];
  let i = 0;
  while (i < ring.length) {
    result.push(ring[i]);
    const max = possibleRunLength(steps, i, ring.length);
    const top = Math.min(ring.length, i + max);

    let best: false | [k: number, dist: number, variance: number] = false;
    for (let k = top - 1; k >= i + 2; k--) {
      let isStraight = true;

      const iVec = ring[i];
      const kVec = ring[k];
      let variance = 0;

      for (let j = i + 1; j < k; j++) {
        const d = distanceToLine(iVec, kVec, ring[j]);
        if (d < 0) {
          console.log(' dist', d);
        }
        variance += d;
        if (d > SQRT1_2) {
          isStraight = false;
          break;
        }
      }

      if (isStraight) {
        const [, , prevV] = best || [0, Infinity, Infinity];
        const avgVar = variance / (k - i);
        const dist = distanceBetween(iVec, kVec);
        if (prevV >= avgVar) {
          best = [k, dist, avgVar];
        }
      }
    }

    i = best ? best[0] : i + 1;
  }

  return result;
}
