import { Vec2 } from '@4bitlabs/vec2';

import type { Ring } from './ring';
import { getBounds } from './get-bounds';
import { xIntersects } from './x-intersects';

export function invertPoly(data: Uint8ClampedArray, size: Vec2, ring: Ring) {
  const [width] = size;
  const bounds = getBounds(ring);
  const [, yMin, , yMax] = bounds;
  for (let y = yMin; y < yMax; y++) {
    const xPairs = xIntersects(ring, y + 0.5);
    for (let pair = 0; pair < xPairs.length; pair += 2) {
      const start = xPairs[pair];
      const end = Math.min(width, xPairs[pair + 1]);
      for (let x = start; x < end; x += 1) {
        data[x + y * width] = data[x + y * width] === 0 ? 255 : 0;
      }
    }
  }
}
