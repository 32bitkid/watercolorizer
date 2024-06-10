import { Vec2 } from '@4bitlabs/vec2';

import type { Ring } from './ring';
import { findFirstEdge } from './find-first-edge';
import { walkEdge } from './walkEdge';
import { invertPoly } from './invert-poly';
import { polygonify } from './polygonify';

interface TraceOptions {
  limit?: number;
  simplifyRuns?: boolean;
  polygonify?: boolean;
  despeckle?: number | false;
  turnPolicy?: 'cw' | 'ccw';
}

export function trace(
  data: Uint8ClampedArray,
  size: Vec2,
  options: TraceOptions = {},
): Ring[] {
  const {
    limit = 16,
    despeckle = false,
    turnPolicy,
    polygonify: toPoly = true,
    simplifyRuns = !toPoly,
  } = options;

  const rings: Ring[] = [];
  const pixels = Uint8ClampedArray.from(data);
  let iterations = 0;
  do {
    const start = findFirstEdge(pixels, size);
    if (!start) break;
    const [ring, bounds, steps] = walkEdge(pixels, size, start, {
      simplifyRuns,
      turnPolicy,
    });

    if (despeckle === false || bounds[0] * bounds[1] > despeckle) {
      const r = toPoly ? polygonify(ring, steps) : ring;
      rings.push(r);
      iterations++;
    }
    invertPoly(pixels, size, ring);
  } while (iterations < limit);

  return rings;
}
