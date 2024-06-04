# @watercolorizer/convolution [![License][license]][npm] [![NPM Version][version]][npm] [![NPM Downloads][dl]][npm]

[npm]: https://www.npmjs.com/package/@watercolorizer/convolution
[version]: https://img.shields.io/npm/v/%40watercolorizer%2Fconvolution
[license]: https://img.shields.io/npm/l/%40watercolorizer%2Fconvolution
[dl]: https://img.shields.io/npm/dy/%40watercolorizer%2Fconvolution

Simple, unoptimized 1D and 2D convolution functions for typed-arrays.

> NOTE: This isn't designed to be high-performance or deal with many, if any, edge cases (like Edge handling)
> in a particularly rigorous way. You probably _do not_ want to use this in production for anything, _ever_.
> ⚠️ **Use at your own risk.** ⚠️

## Getting Started

Perform a 3-unit gaussian-blur approximation on a one-dimensional array with edge wrapping:

```ts
import { convolution1D, K_GAUSS_BLUR_3 } from '@watercolorizer/convolution';

const data = [1, 2, 3, 4, 5, 6, 7, 8];
const output = [];

convolution2D(K_GAUSS_BLUR_3, data, output);

console.log(output);
/* [3, 2.5, 3.125, 4.03125, 5.0078125, 6.001953125, 7.00048828125, 6.5001220703125] */
```

Using typed arrays:

```ts
import { convolution1D, K_GAUSS_BLUR_3 } from '@watercolorizer/convolution';

const input = Uint8ClampedArray.of(1, 2, 3, 4, 5, 6, 7, 8);
const output = new Uint8ClampedArray(8);

convolution2D(K_GAUSS_BLUR_3, input, output);

console.log(output);
/* [3, 2, 3, 4, 5, 6, 7, 6] */
```

## Kernels

Built-in Kernels:

- `K_BOX_BLUR_3` - 3-element 1D box blur
- `K_GAUSS_BLUR_3` - 3-element 1D gaussian-approximation blur
- `K_GAUSS_BLUR_5` - 5-element 1D gaussian-approximation blur
- `K_GAUSS_BLUR_7` - 7-element 1D gaussian-approximation blur


- `K_BOX_BLUR_3x3` - 3&times;3-element 2D box blur
- `K_GAUSS_BLUR_3x3` - 3&times;3-element 2D gaussian-approximation blur
- `K_GAUSS_BLUR_5x5` - 5&times;5-element 2D gaussian-approximation blur
- `K_GAUSS_BLUR_7x7` - 7&times;7-element 2D gaussian-approximation blur

You can also use whatever kernel you want:

```ts
import { Kernel1D, Kernel2D } from '@watercolorizer/convolution';

const myKernel: Kernel1D = [[-1, 0, 1]];
const laplacian: Kernel2D = [
  [0, -1, 0, -1, 4, -1, 0, -1, 0],
  [3, 3],
];
```

Kernels can be either floating point type or integer-with-divisor type kernels... If no divisor is specified in the
kernel, it is assumed to be `1`:

```ts
import { Kernel1D } from '@watercolorizer/convolution';

const fractional: Kernel1D = [Float64Array.of(0.25, 0.5, 0.25)];
const integer: Kernel1D = [Uint8Array.of(1, 2, 1), 4];
```
