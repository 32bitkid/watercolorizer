import { Vec2 } from '@4bitlabs/vec2';
import { segments } from './polygons-helpers';

describe('segments', () => {
  it('should iterate all the way around a looped polygon', () => {
    const points: Vec2[] = [
      [-10, -10],
      [10, -10],
      [10, 10],
      [-10, 10],
    ];
    const result = Array.from(segments(points, true));
    expect(result).toStrictEqual([
      [[-10, -10], [10, -10], 0, 1],
      [[10, -10], [10, 10], 1, 2],
      [[10, 10], [-10, 10], 2, 3],
      [[-10, 10], [-10, -10], 3, 0],
    ]);
  });

  it('should iterate all the way around a looped polygon', () => {
    const points: Vec2[] = [
      [-10, -10],
      [10, -10],
      [10, 10],
      [-10, 10],
    ];
    const result = Array.from(segments(points, false));
    expect(result).toStrictEqual([
      [[-10, -10], [10, -10], 0, 1],
      [[10, -10], [10, 10], 1, 2],
      [[10, 10], [-10, 10], 2, 3],
    ]);
  });
});
