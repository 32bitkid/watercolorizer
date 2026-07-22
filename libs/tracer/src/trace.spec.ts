import { describe, expect, it } from 'vitest';
import type { Ring } from './ring.js';
import { trace } from './trace.js';

const bitmap =
  ([w, h]: [number, number]): ((
    strings: TemplateStringsArray,
  ) => Uint8ClampedArray) =>
  (strings) => {
    if (strings.length !== 1) throw new Error('unexpected format');
    const [string] = strings;
    const lines = string
      .split(/\n/)
      .map((line) => line.trim().replace(/\s/g, ''))
      .filter((it) => it.length === w);

    if (lines.length !== h) throw new Error('malformed input string');

    return lines.reduce(
      (prev, line, idx) => {
        [...line].forEach((c, chIdx) => {
          prev[idx * w + chIdx] = c === '_' ? 0 : ~0 >>> 0;
        });
        return prev;
      },
      new Uint8ClampedArray(w * h),
    );
  };

describe('trace', () => {
  it('should a simple square', () => {
    const data = bitmap([8, 8], { polygonify: false })`
      _ _ _ _ _ _ _ _
      _ _ _ _ _ _ _ _
      _ _ █ █ █ █ _ _
      _ _ █ █ █ █ _ _
      _ _ █ █ █ █ _ _
      _ _ █ █ █ █ _ _
      _ _ _ _ _ _ _ _
      _ _ _ _ _ _ _ _
    `;

    const rings = trace(data, [8, 8]);

    const expectedRing = [
      [2, 2],
      [2, 6],
      [6, 6],
      [6, 2],
    ];
    expect(rings).toStrictEqual([expectedRing]);
  });

  describe('trace', () => {
    it('should trace a polygon with a hole in it', () => {
      const data = bitmap([8, 8])`
      _ _ _ _ _ _ _ _
      _ _ _ _ _ _ _ _
      _ _ █ █ █ █ _ _
      _ _ █ _ _ █ _ _
      _ _ █ _ _ █ _ _
      _ _ █ █ █ █ _ _
      _ _ _ _ _ _ _ _
      _ _ _ _ _ _ _ _
    `;

      const rings = trace(data, [8, 8], { polygonify: false });

      const outerRing: Ring = [
        [2, 2],
        [2, 6],
        [6, 6],
        [6, 2],
      ];

      const innerRing: Ring = [
        [3, 3],
        [5, 3],
        [5, 5],
        [3, 5],
      ];

      expect(rings).toStrictEqual([outerRing, innerRing]);
    });

    it('should walk around non-uniform shapes', () => {
      const data = bitmap([9, 9])`
      _ _ _ _ _ _ _ _ _
      _ █ █ █ _ █ █ █ _
      _ █ █ █ _ █ █ █ _      
      _ █ █ █ █ █ █ █ _
      _ _ _ █ █ █ _ _ _
      _ █ █ █ █ █ █ █ _
      _ █ █ █ _ █ █ █ _
      _ █ █ █ _ █ █ █ _
      _ _ _ _ _ _ _ _ _
      `;

      const rings = trace(data, [9, 9], { polygonify: false });
      expect(rings).toStrictEqual([
        [
          [1, 1],
          [1, 4],
          [3, 4],
          [3, 5],
          [1, 5],
          [1, 8],
          [4, 8],
          [4, 6],
          [5, 6],
          [5, 8],
          [8, 8],
          [8, 5],
          [6, 5],
          [6, 4],
          [8, 4],
          [8, 1],
          [5, 1],
          [5, 3],
          [4, 3],
          [4, 1],
        ],
      ]);
    });
  });

  it('should handle a complex shape', () => {
    const data = bitmap([8, 8])`
      _ _ _ _ _ _ _ _
      _ █ █ █ █ █ █ _
      _ █ █ █ █ █ █ _
      _ █ █ _ █ █ █ _
      _ █ _ █ _ █ █ _
      _ █ █ █ _ █ █ _
      _ █ █ █ _ █ █ _
      _ _ _ _ _ _ _ _
      `;

    const rings = trace(data, [8, 8], { turnPolicy: 'ccw', polygonify: false });
    expect(rings[0]).toStrictEqual([
      [1, 1],
      [1, 7],
      [4, 7],
      [4, 4],
      [5, 4],
      [5, 7],
      [7, 7],
      [7, 1],
    ]);

    expect(rings[1]).toStrictEqual([
      [3, 3],
      [4, 3],
      [4, 4],
      [3, 4],
      [3, 5],
      [2, 5],
      [2, 4],
      [3, 4],
    ]);
  });

  it('should respect turnPolicy', () => {
    const data = bitmap([8, 8])`
      _ _ _ _ _ _ _ _
      _ █ █ █ █ █ █ _
      _ █ █ █ █ █ █ _
      _ █ █ _ █ █ █ _
      _ █ _ █ _ █ █ _
      _ █ █ █ _ █ █ _
      _ █ █ █ _ █ █ _
      _ _ _ _ _ _ _ _
      `;

    const ccwTurn = trace(data, [8, 8], {
      turnPolicy: 'ccw',
      polygonify: false,
    });
    const cwTurn = trace(data, [8, 8], { turnPolicy: 'cw', polygonify: false });

    expect(ccwTurn.length).toBe(2);
    expect(cwTurn.length).toBe(2);
  });
});
