import type { TypedArray } from './typed-array';

export type Kernel1D = [TypedArray, number?];

export type EdgeHandlingTypes = 'wrap' | 'extend' | 'mirror';

const edgeHandlers: Record<
  EdgeHandlingTypes,
  (i: number, width: number) => number
> = {
  wrap: (i, width) => (i >= 0 && i < width ? i : (i + width) % width),
  extend: (i, width) => (i < 0 ? 0 : i >= width ? width - 1 : i),
  mirror: (i, width) => {
    if (i >= 0 && i < width) return i;
    const ii = (i < 0 ? -i - 1 : i) % (width * 2);
    return ii < width ? ii : width * 2 - ii - 1;
  },
};

interface ConvolutionOptions1D {
  edge?: EdgeHandlingTypes;
}

export function convolution1D<T extends TypedArray>(
  kern: Kernel1D,
  source: TypedArray,
  dest: T,
  options: ConvolutionOptions1D = {},
): T {
  const [kernel, div = 1] = kern;
  const { edge = 'wrap' } = options;

  const kWidth = kernel.length;
  const sWidth = source.length;
  const kMidW = Math.floor(kWidth / 2);

  const limit = edgeHandlers[edge];

  for (let j = 0; j < sWidth; ++j) {
    let sum = 0;
    for (let n = 0; n < kWidth; ++n) {
      const jn = j + (n - kMidW);
      const sIdx = limit(jn, sWidth);
      sum += source[sIdx] * kernel[n];
    }
    dest[j] = sum / div;
  }
  return dest;
}
