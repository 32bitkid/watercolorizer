import { convolution1D, Kernel1D } from './convolution1d';

describe('1d convoultion', () => {
  describe('edge handling', () => {
    it('should use wrap as default', () => {
      const kern: Kernel1D = [[1, 1, 1], 3];
      const data = [0, 0, 0, 1, 1, 1];
      const result = Array<number>(6);
      convolution1D(kern, data, result);
      expect(result).toStrictEqual([1 / 3, 0, 1 / 3, 2 / 3, 1, 2 / 3]);
    });

    it('should handle wrap', () => {
      const kern: Kernel1D = [[1, 1, 1], 3];
      const data = [0, 0, 0, 1, 1, 1];
      const result = Array<number>(6);
      convolution1D(kern, data, result, { edge: 'wrap' });
      expect(result).toStrictEqual([1 / 3, 0, 1 / 3, 2 / 3, 1, 2 / 3]);
    });

    it('should handle extend', () => {
      const kern: Kernel1D = [[1, 1, 1], 3];
      const data = [0, 0, 0, 1, 1, 1];
      const result = Array<number>(6);
      convolution1D(kern, data, result, { edge: 'extend' });
      expect(result).toStrictEqual([0, 0, 1 / 3, 2 / 3, 1, 1]);
    });

    it('should handle mirror', () => {
      const kern: Kernel1D = [[1, 1, 1, 1, 1, 1], 6];
      const data = [1, 1, 1, 0, 0, 0];
      const result = Array<number>(6);
      convolution1D(kern, data, result, { edge: 'mirror' });
      expect(result).toStrictEqual([1, 5 / 6, 4 / 6, 3 / 6, 2 / 6, 1 / 6]);
    });
  });
});
