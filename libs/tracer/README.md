# @watercolorizer/tracer [![License][license]][npm] [![NPM Version][version]][npm] [![NPM Downloads][dl]][npm]

[npm]: https://www.npmjs.com/package/@watercolorizer/tracer
[version]: https://img.shields.io/npm/v/%40watercolorizer%2Ftracer
[license]: https://img.shields.io/npm/l/%40watercolorizer%2Ftracer
[dl]: https://img.shields.io/npm/dy/%40watercolorizer%2Ftracer

Efficiently create polygonal outlines of 1-bit bitmap images; where _zero_ is an "empty" pixel, and any _non-zero_ value is considered "filled".

## Getting Started

```ts
import { trace } from '@watercolorizer/tracer';

const bitmapSize: [width: number, height: number] = [100, 100];
const pixelData = new Uint8ClampedArray(bitmapSize[0] * bitmapSize[1]);
const loops = trace(pixelData, bitmapSize);

/* fill pixel data with data */

loops.forEach(() => {
  /* render each loop */
});
```

Example rendering with HTML `<canvas>`:

```ts
const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

ctx.beginPath();
loops.forEach((loop) => {
  const [first, ...rest] = loop;
  ctx.moveTo(...first);
  rest.forEach((p) => ctx.lineTo(...p));
  ctx.lineTo(...first);
});
ctx.fillStyle = 'black';
ctx.fill('evenodd');
```

## Options

- `limit` - Limit the total number of loops returned. Default: `16`
- `simplifyRuns` - Simplify multistep cardinal lines in the same direction. Default: `true`
- `despeckle` - Remove loops that have a bounding box are smaller than this value. Default: `false`
- `turnPolicy` - Which direct to turn when loop direction is ambigous, either `"ccw"` (counter-clockwise) or `"cw"` (clockwise) from the current direction. Default: `"ccw"`

```ts
const bitmapSize: [width: number, height: number] = [100, 100];
const pixelData = new Uint8ClampedArray(bitmapSize[0] * bitmapSize[1]);
const loops = trace(pixelData, bitmapSize, {
  limit: 1, // stop after resolving a single loop
  simplifyRuns: false, // do not simplify cardinal runs
});
```

## Future work

- Phase 2: Polygonal path simplification
- Phase 3: Bezier appoximations