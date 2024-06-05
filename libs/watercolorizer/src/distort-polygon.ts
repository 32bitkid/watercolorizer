import {
  add as vecAdd,
  distanceBetween,
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

export interface DistortPolyOptions {
  angleSD?: number;
  blurWeightsOnDistort?: boolean;
  gaussRng?: GaussianRngFn;
}

export function distortPolygon(
  [points, weights]: PointsAndWeights,
  options: DistortPolyOptions = {},
): PointsAndWeights {
  const {
    angleSD = Math.PI / 4,
    blurWeightsOnDistort = false,
    gaussRng = unsafeGaussRng,
  } = options;

  const midPoints: Points = [];
  const midWeights: Weights = [];

  for (const segment of segments(points, true)) {
    const [a, b, i0, i1] = segment;
    const w0 = weights[i0] ?? 1;
    const w1 = weights[i1] ?? 1;

    const mid = clamp(0.001, 0.999, gaussRng(0.5, 0.4 / 3));
    const midPoint = vec2(lerp(a[0], b[0], mid), lerp(a[1], b[1], mid));
    const weight = lerp(w0, w1, mid);

    // Find tangent
    const tan = vec2();
    vecSub(b, a, tan);
    vecNorm(tan, tan);
    const theta = gaussRng(Math.PI / 2, angleSD / 3);
    vecRotate(tan, theta, tan);

    // Find dist
    const len = distanceBetween(a, b);
    const scale = gaussRng(0, len / 3);
    const s2 = scale < 0 ? scale / 5 : scale;

    vecScale(tan, s2 * weight, tan);
    vecAdd(midPoint, tan, midPoint);

    midPoints.push(midPoint);
    midWeights.push(weight);
  }

  const nextPoints = Array.from(
    zipper(wigglePolygon(points, weights, { gaussRng }), midPoints),
  );

  let nextWeights = Array.from(zipper(weights, midWeights));
  if (blurWeightsOnDistort)
    nextWeights = conv1d(
      K_GAUSS_BLUR_3,
      nextWeights,
      Array.from<number>({ length: nextWeights.length }),
    );

  return [assertOK(nextPoints), nextWeights];
}
