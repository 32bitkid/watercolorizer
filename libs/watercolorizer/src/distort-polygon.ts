import {
  add as vecAdd,
  distanceBetween,
  lerp as vecLerp,
  normalize as vecNorm,
  rotate as vecRotate,
  scale as vecScale,
  sub as vecSub,
  vec2,
} from '@4bitlabs/vec2';

import {
  convolution1D as conv1d,
  K_GAUSS_BLUR_3,
} from '@watercolorizer/convolution';
import { segments } from './polygons-helpers';
import { GaussianRngFn, unsafeGaussRng } from './rng';
import { lerp, clamp } from './maths';
import { Points, PointsAndWeights, Weights } from './types';
import { wigglePolygon } from './wiggle-polygon';
import { zipper } from './zipper';
import { assertOK } from './assert-vec2-ok';
import { WindingOrder } from './winding-order';

export interface DistortPolyOptions {
  blurWeightsOnDistort?: boolean;
  gaussRng?: GaussianRngFn;
  midPointFn?: (len: number, weights: [w0: number, w1: number]) => number;
  thetaFn?: (len: number, weight: number) => number;
  magnitudeFn?: (len: number, weight: number) => number;
  wiggle?: boolean;
  windingOrder?: WindingOrder;
}

export function distortPolygon(
  [points, weights]: PointsAndWeights,
  options: DistortPolyOptions = {},
): PointsAndWeights {
  const {
    blurWeightsOnDistort = false,
    gaussRng = unsafeGaussRng,
    thetaFn = () => gaussRng(0, Math.PI / 12),
    midPointFn = () => clamp(0.001, 0.999, gaussRng(0.5, 0.4 / 3)),
    magnitudeFn = (len, weight) => {
      const scale = gaussRng(0, len / 3);
      const s2 = scale < 0 ? scale / 5 : scale;
      return s2 * weight;
    },
    wiggle = true,
    windingOrder = 'cw',
  } = options;

  const midPoints: Points = [];
  const midWeights: Weights = [];

  for (const segment of segments(points)) {
    const [a, b, i0, i1] = segment;
    const w0 = weights[i0] ?? 1;
    const w1 = weights[i1] ?? 1;

    const len = distanceBetween(a, b);
    const mid = midPointFn(len, [w0, w1]);
    const midPoint = vecLerp(a, b, mid);
    const weight = lerp(w0, w1, mid);

    // Find tangent
    const tan = vec2();
    vecSub(b, a, tan);
    vecNorm(tan, tan);

    const edgeTangent = windingOrder === 'cw' ? Math.PI / 2 : -Math.PI / 2;
    const theta = edgeTangent + thetaFn(len, weight);
    vecRotate(tan, theta, tan);

    // Find dist
    const magnitude = magnitudeFn(len, weight);
    vecScale(tan, magnitude, tan);
    vecAdd(midPoint, tan, midPoint);

    midPoints.push(midPoint);
    midWeights.push(weight);
  }

  const prevPoints = wiggle
    ? wigglePolygon(points, weights, { gaussRng })
    : points;

  const nextPoints = Array.from(zipper(prevPoints, midPoints));

  let nextWeights = Array.from(zipper(weights, midWeights));
  if (blurWeightsOnDistort)
    nextWeights = conv1d(
      K_GAUSS_BLUR_3,
      nextWeights,
      Array.from<number>({ length: nextWeights.length }),
    );

  return [assertOK(nextPoints), nextWeights];
}
