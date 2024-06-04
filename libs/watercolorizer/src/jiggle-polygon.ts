import { Vec2 } from '@4bitlabs/vec2';

import { gaussRng } from './gauss-rng';

export const jigglePolygon = (points: Vec2[], sigma: number = 2 / 3) =>
  points.map<Vec2>(([x, y]) => [
    x + gaussRng(0, sigma),
    y + gaussRng(0, sigma),
  ]);
