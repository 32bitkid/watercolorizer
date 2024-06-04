import type { TypedArray } from './typed-array';

export type Kernel2D = [TypedArray, [number, number], number?];

export function convolution2D<T extends TypedArray>(
  kTuple: Kernel2D,
  source: TypedArray,
  [sWidth, sHeight]: [number, number],
  dest: T,
): T {
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
      dest[i * sWidth + j] = sum / div;
    }
  }

  return dest;
}
