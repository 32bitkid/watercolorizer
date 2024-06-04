import { zipper } from './zipper';

describe('zipper', () => {
  it('should zip together two arrays', () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const other = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const result = Array.from(zipper<string | number>(data, other));
    const expected = [
      1,
      'a',
      2,
      'b',
      3,
      'c',
      4,
      'd',
      5,
      'e',
      6,
      'f',
      7,
      'g',
      8,
      'h',
      9,
    ];
    expect(result).toStrictEqual(expected);
  });

  it('should ignore any values beyond the end of the first array', () => {
    const data = [1, 2, 3, 4];
    const other = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const result = Array.from(zipper<string | number>(data, other));
    const expected = [1, 'a', 2, 'b', 3, 'c', 4];
    expect(result).toStrictEqual(expected);
  });

  it('should zip than two arrays', () => {
    const data = [1, 2, 3, 4];
    const other1 = ['a', 'b', 'c'];
    const other2 = ['x', 'y', 'z'];
    const result = Array.from(zipper<string | number>(data, other1, other2));
    const expected = [1, 'a', 'x', 2, 'b', 'y', 3, 'c', 'z', 4];
    expect(result).toStrictEqual(expected);
  });

  it('should only yield values that exist', () => {
    const data = [1, 2, 3, 4];
    const other1 = ['a', 'b'];
    const other2 = ['x'];
    const result = Array.from(zipper<string | number>(data, other1, other2));
    const expected = [1, 'a', 'x', 2, 'b', 3, 4];
    expect(result).toStrictEqual(expected);
  });
});
