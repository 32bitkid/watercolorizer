import type { Vec2 } from '@4bitlabs/vec2';
import { findFirstEdge } from './find-first-edge.js';
import { invertPoly } from './invert-poly.js';
import { polygonify } from './polygonify.js';
import type { Ring } from './ring.js';
import { walkEdge } from './walk-edge.js';

interface TraceOptions {
  limit?: number;
  simplifyRuns?: boolean;
  polygonify?: boolean;
  despeckle?: number | false;
  turnPolicy?: 'cw' | 'ccw';
  emptyValue?: number;
}

export function trace(
  data: Uint8ClampedArray,
  size: Vec2,
  options: TraceOptions = {},
): Ring[] {
  const {
    limit = 16,
    despeckle = false,
    turnPolicy: initialTurnPolicy = 'ccw',
    polygonify: toPoly = true,
    simplifyRuns = !toPoly,
    emptyValue = 0,
  } = options;

  const rings: Ring[] = [];
  const pixels = Uint8ClampedArray.from(data);
  let iterations = 0;
  let turnPolicy = initialTurnPolicy;
  do {
    const start = findFirstEdge(pixels, size, emptyValue);
    if (!start) break;

    const [ring, bounds, steps] = walkEdge(pixels, size, start, {
      simplifyRuns,
      turnPolicy,
      emptyValue,
    });

    if (despeckle === false || bounds[0] * bounds[1] > despeckle) {
      const r = toPoly ? polygonify(ring, steps) : ring;
      rings.push(r);
      iterations++;
    }
    invertPoly(pixels, size, ring);
    turnPolicy = turnPolicy === 'ccw' ? 'cw' : 'ccw';
  } while (iterations < limit);

  return rings;
}
