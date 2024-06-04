# @watercolorizer/watercolorizer [![License][license]][npm] [![NPM Version][version]][npm] [![NPM Downloads][dl]][npm]

![watercolorizer logo](https://j.holmes.codes/images/watercolorizer/watercolorizer.png)

[npm]: https://www.npmjs.com/package/@watercolorizer/watercolorizer
[version]: https://img.shields.io/npm/v/%40watercolorizer%2Fwatercolorizer
[license]: https://img.shields.io/npm/l/%40watercolorizer%2Fwatercolorizer
[dl]: https://img.shields.io/npm/dy/%40watercolorizer%2Fwatercolorizer

**Watercolorizer** is a _tiny_ graphics library for creating generative watercolor-like shapes from
simple polygonal base-shapes. This _core_ library is un-opinionated about _how_ these paths get rendered,
instead is just the generative algorithm for creating the paths _to_ render.


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
    ctx.closePath();
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
- `blurWeightsOnDistort` - Apply a 3-element gaussian blend on the derived weights for distorted edges. Default: `false`
- `simplifyAfterPreEvolution` - Apply polygonal simplification after the _pre-evolution_ phase. Default: `1`
- `simplifyEachEvolution` - Apply polygonal simplification during each _evolutionary_ phase. Default: `false`

For example:

```ts
// Distort and subdivide the polygon 10 times and skip simplification
const options = {
  preEvolutions: 10,
  simplifyAfterPreEvolution: false,
};

for (const layer of watercolorize(poly, options)) {
  drawLayer(layer); /* however you choose to render the layer */
}
```

## Examples

Sketches created with **watercolorizer** and **rough.js**

![watercolorizer logo](https://j.holmes.codes/images/watercolorizer/example-colonels-bequest.jpg)
![watercolorizer logo](https://j.holmes.codes/images/watercolorizer/example-codename-iceman.jpg)
![watercolorizer logo](https://j.holmes.codes/images/watercolorizer/example-roger-wilco.jpg)

## Inspiration & Credits

- [Tyler Hobbs](https://www.tylerxhobbs.com/) talk at [Strange Loop Conference 2017](https://www.youtube.com/watch?v=5R9eywArFTE). Most of the core algorithms are implemented using this talk as a basis for the interface.
- Also see the associated blog: [How to Hack a Painting](https://www.tylerxhobbs.com/words/how-to-hack-a-painting) by [Tyler Hobbs](https://www.tylerxhobbs.com/), though the actual talk is perhaps more _illuminating_ at least for me.
- The original *need* for this library was being inspired by artwork of [Douglas Herring](http://www.douglasherring.com/)
  in the release of [The Colonel's Bequest](https://en.wikipedia.org/wiki/The_Colonel%27s_Bequest) and wanting to create
  generative-art based on those sources.
