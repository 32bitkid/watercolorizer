import { Kernel1D } from './convolution1d';
import { Kernel2D } from './convolution2d';

export const K_BOX_BLUR_3: Kernel1D = [Uint8Array.of(1, 1, 1), 3];
export const K_GAUSS_BLUR_3: Kernel1D = [Uint8Array.of(1, 2, 1), 4];
export const K_GAUSS_BLUR_5: Kernel1D = [Uint8Array.of(1, 4, 6, 4, 1), 16];
export const K_GAUSS_BLUR_7: Kernel1D = [
  Uint8Array.of(2, 7, 14, 18, 14, 7, 2),
  64,
];

export const K_BOX_BLUR_3x3: Kernel2D = [
  // prettier-ignore
  Uint8ClampedArray.of(
    1, 1, 1,
    1, 1, 1,
    1, 1, 1,
  ),
  [3, 3],
  9,
];

export const K_GAUSS_BLUR_3x3: Kernel2D = [
  // prettier-ignore
  Uint8ClampedArray.of(
    1, 2, 1,
    2, 4, 4,
    1, 2, 1,
  ),
  [3, 3],
  16,
];

export const K_GAUSS_BLUR_5x5: Kernel2D = [
  // prettier-ignore
  Uint8ClampedArray.of(
    1,  4,  6,  4, 1,
    4, 16, 24, 16, 4,
    6, 24, 36, 24, 6,
    4, 16, 24, 16, 4,
    1,  4,  6,  4, 1,
  ),
  [5, 5],
  256,
];

export const K_GAUSS_BLUR_7x7: Kernel2D = [
  // prettier-ignore
  Uint8ClampedArray.of(
    0,  0,  1,   2,  1,  0, 0,
    0,  3, 13,  22, 13,  3, 0,
    1, 13, 59,  97, 59, 13, 1,
    2, 22, 97, 159, 97, 22, 2,
    1, 13, 59,  97, 59, 13, 1,
    0,  3, 13,  22, 13,  3, 0,
    0,  0,  1,   2,  1,  0, 0,
  ),
  [7, 7],
  1003,
];
