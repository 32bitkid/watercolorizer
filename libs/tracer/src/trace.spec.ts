import { trace } from './trace';
import { Ring } from './ring';

describe('trace', () => {
  it('should trace a polygon with a hole in it', () => {
    // prettier-ignore
    const data = Uint8ClampedArray.of(
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00,
      0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00,
      0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00,
      0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    );

    const rings = trace(data, [8, 8]);

    const outerRing: Ring = [
      [2, 2],
      [2, 6],
      [6, 6],
      [6, 2],
    ];

    const innerRing: Ring = [
      [3, 3],
      [3, 5],
      [5, 5],
      [5, 3],
    ];

    expect(rings).toStrictEqual([outerRing, innerRing]);
  });

  it('should respect turnPolicy', () => {
    // prettier-ignore
    const data = Uint8ClampedArray.of(
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x00,
      0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x00,
      0x00, 0xff, 0xff, 0x00, 0xff, 0xff, 0xff, 0x00,
      0x00, 0xff, 0x00, 0xff, 0x00, 0xff, 0xff, 0x00,
      0x00, 0xff, 0xff, 0xff, 0x00, 0xff, 0xff, 0x00,
      0x00, 0xff, 0xff, 0xff, 0x00, 0xff, 0xff, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    );

    const ccwTurn = trace(data, [8, 8], { turnPolicy: 'ccw' });
    const cwTurn = trace(data, [8, 8], { turnPolicy: 'cw' });

    expect(ccwTurn.length).toBe(1);
    expect(cwTurn.length).toBe(2);
  });
});
