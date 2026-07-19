import type { Vec2 } from '@4bitlabs/vec2';
import { describe, expect, it } from 'vitest';

import { segments } from './polygons-helpers.js';

describe('segments', () => {
  it('should iterate all the way around a looped polygon', () => {
    const points: Vec2[] = [
      [-10, -10],
      [10, -10],
      [10, 10],
      [-10, 10],
    ];
    const result = Array.from(segments(points));
    expect(result).toStrictEqual([
      [[-10, -10], [10, -10], 0, 1],
      [[10, -10], [10, 10], 1, 2],
      [[10, 10], [-10, 10], 2, 3],
      [[-10, 10], [-10, -10], 3, 0],
    ]);
  });
});
