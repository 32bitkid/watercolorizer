import { windingOrderOf } from './winding-order';

describe('windingOrderOf()', () => {
  it('should detect clockwise winding', () => {
    const cwOctagon: [number, number][] = [
      [0, 1],
      [Math.SQRT1_2, Math.SQRT1_2],
      [1, 0],
      [Math.SQRT1_2, -Math.SQRT1_2],
      [0, -1],
      [-Math.SQRT1_2, -Math.SQRT1_2],
      [-1, 0],
      [-Math.SQRT1_2, Math.SQRT1_2],
    ];
    expect(windingOrderOf(cwOctagon)).toBe('cw');
  });

  it('should detect counter-clockwise winding', () => {
    const ccwOctagon: [number, number][] = [
      [0, 1],
      [-Math.SQRT1_2, Math.SQRT1_2],
      [-1, 0],
      [-Math.SQRT1_2, -Math.SQRT1_2],
      [0, -1],
      [Math.SQRT1_2, -Math.SQRT1_2],
      [1, 0],
      [Math.SQRT1_2, Math.SQRT1_2],
    ];
    expect(windingOrderOf(ccwOctagon)).toBe('ccw');
  });
});
