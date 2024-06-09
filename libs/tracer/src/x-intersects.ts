import { Vec2 } from '@4bitlabs/vec2';

import { getSegments } from './get-segments';

export const xIntersects = (
  verts: Vec2[],
  y: number,
  loop = true,
): number[] => {
  const result: number[] = [];
  for (const [[x0, y0], [x1, y1]] of getSegments(verts, loop)) {
    if (y <= Math.min(y0, y1)) continue;
    if (y > Math.max(y0, y1)) continue;

    const x_intersection = ((y - y0) * (x1 - x0)) / (y1 - y0) + x0;
    result.push(x_intersection);
  }
  return result.sort((a, b) => a - b);
};
