import type { Vec2 } from '@4bitlabs/vec2';

import { segments } from './polygons-helpers';

export type WindingOrder = 'cw' | 'ccw';

export function windingOrderOf(points: Vec2[]): WindingOrder {
  let sum = 0;
  for (const [[x0, y0], [x1, y1]] of segments(points)) {
    sum += (x1 - x0) * (y1 + y0);
  }
  return sum >= 0 ? 'cw' : 'ccw';
}
