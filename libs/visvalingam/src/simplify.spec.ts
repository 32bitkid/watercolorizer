import { simplify, Triplet } from './simplify';
import { areaOfTuple as areaOf } from './weight-functions';

type PointTuple = [number, number];

describe('Visvalingam', () => {
  it('should simplify a straight line', () => {
    const points: PointTuple[] = [
      [0, 0],
      [1, 4],
      [2, 8],
      [3, 12],
      [4, 16],
    ];

    const actual = simplify(areaOf, points, 2);
    expect(actual).toStrictEqual([
      [0, 0],
      [4, 16],
    ]);
  });

  it('should remove point that has the smallest influential area', () => {
    const points: PointTuple[] = [
      [0, 0],
      [30, 0],
      [30, 40],
      [45, 40],
      [45, 60],
      [48, 60],
      [48, 66],
    ];

    const actual = simplify(areaOf, points, 6);
    expect(actual).toStrictEqual([
      [0, 0],
      [30, 0],
      [30, 40],
      [45, 40],
      [45, 60],
      [48, 66],
    ]);
  });

  it('should multiple points', () => {
    const points: PointTuple[] = [
      [0, 0],
      [30, 0],
      [30, 40],
      [45, 40],
      [45, 60],
      [48, 60],
      [48, 66],
    ];

    const actual = simplify(areaOf, points, 5);
    expect(actual).toStrictEqual([
      [0, 0],
      [30, 0],
      [30, 40],
      [45, 40],
      [48, 66],
    ]);
  });

  it('should multiple points', () => {
    const points: PointTuple[] = [
      [0, 0],
      [30, 0],
      [30, 40],
      [45, 40],
      [45, 60],
      [48, 60],
      [48, 66],
    ];

    const actual = simplify(areaOf, points, 3);
    expect(actual).toStrictEqual([
      [0, 0],
      [30, 0],
      [48, 66],
    ]);
  });

  it('should remove until the limitFn returns false', () => {
    const points: PointTuple[] = [
      [0, 0],
      [30, 0],
      [30, 40],
      [45, 40],
      [45, 60],
      [48, 60],
      [48, 66],
    ];

    const actual = simplify(areaOf, points, (w) => w < 100);
    expect(actual).toStrictEqual([
      [0, 0],
      [30, 0],
      [30, 40],
      [45, 40],
      [48, 66],
    ]);
  });

  it('should simplify a straight line if weightFn always returns true', () => {
    const points: PointTuple[] = [
      [0, 0],
      [30, 0],
      [30, 40],
      [45, 40],
      [45, 60],
      [48, 60],
      [48, 66],
    ];

    const actual = simplify(areaOf, points, () => true);
    expect(actual).toStrictEqual([
      [0, 0],
      [48, 66],
    ]);
  });

  describe('edge cases', () => {
    it('should stop simplifying if the weight function returns infinity', () => {
      const points: PointTuple[] = [
        [0, 0],
        [30, 0],
        [30, 40],
        [45, 40],
        [45, 60],
        [48, 60],
        [48, 66],
      ];

      const customFn = (it: Triplet<PointTuple>) => {
        const actual = areaOf(it);
        return actual > 100 ? Infinity : actual;
      };

      const actual = simplify(customFn, points, 3);
      expect(actual).toStrictEqual([
        [0, 0],
        [30, 0],
        [30, 40],
        [45, 40],
        [48, 66],
      ]);
    });
  });
});
