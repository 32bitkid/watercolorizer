# @watercolorize/watercolorize3 [![License][license]][npm] [![NPM Version][version]][npm] [![NPM Downloads][dl]][npm]

[npm]: https://www.npmjs.com/package/@watercolorize/watercolorize3
[version]: https://img.shields.io/npm/v/%40watercolorize%2Fwatercolorize3
[license]: https://img.shields.io/npm/l/%40watercolorize%2Fwatercolorize3
[dl]: https://img.shields.io/npm/dy/%40watercolorize%2Fwatercolorize3

Simple, unoptimized 1D and 2D watercolorize3 functions for typed-arrays.

## Getting Started

```ts
import { watercolorize } from '@watercolorizer/watercolorizer';

function renderToCanvas(
  ctx: CanvasRenderingContext2D,
  points: [number, number][],
) {
  for (const layer of watercolorize(poly)) {
    const [first, ...rest] = layer;
    ctx.beginPath();
    ctx.moveTo(first[0], first[1]);
    rest.forEach(([x, y]) => ctx.lineTo(x, y));
    ctx.clsoePath();
    ctx.fillStyle = 'rgba(0 100 255 / 10%)';
    ctx.fill();
  }
}

const polygon = [
  [20, 20],
  [50, 20],
  [50, 50],
  [20, 50],
];
renderToCanvas(ctx, polygon);
```

## Options

- `preEvolutions` - Number of pre-evolutions. Default: `0`
- `evolutions` - Number of total evolutions. Default: `5`
- `layersPerEvolution` - Number of layers per evolutionary-step. Default: `3`
- `layerEvolutions` - Number of evolutions applied to each layer. Default: `3`
- `vertexWeights` - Scalar for each vertex in points which controls the magnitude of distortion per iteration. Default: `undefined`
- `blurWeightsOnDistort` - Apply a 3-element gaussian blend on the derivied weights for distorted edges. Default: `false`
- `simplifyAfterPreEvolution` - Apply polygonal simplification after the _pre-evolution_ phase. Default: `1`
- `simplifyEachEvolution` - Apply polygonal simplification during each _evolutionary_ phase. Default: `false`

```ts
// Distort and subdivide the polygon 10 times and skip simplification
const options = {
  preEvolutions: 10,
  simplifyAfterPreEvolution: false,
};

for (const layer of watercolorize(poly)) {
  /* drawLayer */
}
```
