import { type DitherOptions, getDitherFn } from './dither.js';
import type { TypedArray } from './typed-array.js';

export type Kernel2D = [TypedArray, [number, number], number?];

export interface ConvolutionOptions2D {
  dither?: DitherOptions;
}

export function convolution2D<T extends TypedArray>(
  kTuple: Kernel2D,
  source: TypedArray,
  [sWidth, sHeight]: [number, number],
  dest: T,
  options: ConvolutionOptions2D = {},
): T {
  const ditherFn = getDitherFn(options?.dither ?? { type: 'none' });

  const [kernel, [kWidth, kHeight], div = 1] = kTuple;
  const [kMidW, kMidH] = [Math.floor(kWidth / 2), Math.floor(kHeight / 2)];

  for (let i = 0; i < sHeight; ++i) {
    for (let j = 0; j < sWidth; ++j) {
      let sum = 0;
      for (let m = 0; m < kHeight; ++m) {
        for (let n = 0; n < kWidth; ++n) {
          const im = i + (m - kMidH);
          const jn = j + (n - kMidW);
          if (im >= 0 && im < sHeight && jn >= 0 && jn < sWidth) {
            sum += source[im * sWidth + jn] * kernel[n + m * kWidth];
          }
        }
      }
      dest[i * sWidth + j] = ditherFn(i, j, sum / div);
    }
  }

  return dest;
}
