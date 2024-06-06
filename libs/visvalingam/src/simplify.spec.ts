import { simplify, Triplet } from './simplify';

type PointTuple = [number, number];
const areaOf = ([[x0, y0], [x1, y1], [x2, y2]]: Triplet<PointTuple>) =>
  Math.abs((x0 - x2) * (y1 - y0) - (x0 - x1) * (y2 - y0));

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
});
