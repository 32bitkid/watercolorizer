import {
  isEqual,
  add as vecAdd,
  length as vecLen,
  normalize as vecNorm,
  rotate as vecRotate,
  scale as vecScale,
  sub as vecSub,
} from '@4bitlabs/vec2';
import { assertOK } from './assert-vec2-ok';
import { triplets } from './polygons-helpers';
import { type GaussianRngFn, unsafeGaussRng } from './rng';
import type { Points, Weights } from './types';

interface WigglePolygonOptions {
  gaussRng?: GaussianRngFn;
}

export function wigglePolygon(
  points: Points,
  weights: Weights,
  options: WigglePolygonOptions = {},
): Points {
  const { gaussRng = unsafeGaussRng } = options;

  const next: Points = [];
  for (const [a, b, c, i] of triplets(points)) {
    const ab = vecSub(b, a);
    const cb = vecSub(b, c);
    const dir = vecAdd(ab, cb);

    if (isEqual(dir, [0, 0])) {
      next.push(b);
      continue;
    }

    vecNorm(dir, dir);
    vecRotate(dir, gaussRng(0, 0.5), dir);

    const weight = weights[i];
    const arcDist = (vecLen(ab) + vecLen(cb)) / 2 / 3;
    vecScale(dir, Math.abs(gaussRng(0, arcDist / 3)) * weight, dir);
    next.push(vecAdd(b, dir));
  }
  return assertOK(next);
}
