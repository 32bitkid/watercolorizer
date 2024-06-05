import { Vec2 } from '@4bitlabs/vec2';

import { unsafeGaussRng } from './rng';

export const jigglePolygon = (points: Vec2[], sigma: number = 2 / 3) =>
  points.map<Vec2>(([x, y]) => [
    x + unsafeGaussRng(0, sigma),
    y + unsafeGaussRng(0, sigma),
  ]);
