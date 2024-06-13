import { windingOrderOf } from './winding-order';

describe('windingOrderOf()', () => {
  it('should detect clockwise winding', () => {
    const cwOctagon: [number, number][] = [
      [0, 1],
      [0.70711, 0.70711],
      [1, 0],
      [0.70711, -0.70711],
      [0, -1],
      [-0.70711, -0.70711],
      [-1, 0],
      [-0.70711, 0.70711],
    ];
    expect(windingOrderOf(cwOctagon, true)).toBe('cw');
  });

  it('should detect counter-clockwise winding', () => {
    const ccwOctagon: [number, number][] = [
      [0, 1],
      [-0.70711, 0.70711],
      [-1, 0],
      [-0.70711, -0.70711],
      [0, -1],
      [0.70711, -0.70711],
      [1, 0],
      [0.70711, 0.70711],
    ];
    expect(windingOrderOf(ccwOctagon, true)).toBe('ccw');
  });
});
