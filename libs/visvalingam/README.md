# @watercolorizer/visvalingam [![License][license]][npm] [![NPM Version][version]][npm] [![NPM Downloads][dl]][npm]

[npm]: https://www.npmjs.com/package/@watercolorizer/visvalingam
[version]: https://img.shields.io/npm/v/%40watercolorizer%2Fvisvalingam
[license]: https://img.shields.io/npm/l/%40watercolorizer%2Fvisvalingam
[dl]: https://img.shields.io/npm/dy/%40watercolorizer%2Fvisvalingam

[Visvalingam–Whyatt algorithm](https://en.wikipedia.org/wiki/Visvalingam%E2%80%93Whyatt_algorithm) for line simplification.

## Getting Started

```ts
import { simplify } from '@watercolorizer/visvalingam';

type Vertex = { x: number; y: number };
const points: Vertex[] = [
  /* ...your points here */
];

const areaOfTriangle = ([v0, v1, v2]: [Vertex, Vertex, Vertex]) =>
  Math.abs((v0.x - v2.x) * (v1.y - v0.y) - (v0.x - v1.x) * (v2.y - v0.y));

// Simplify polyline in points to 10, removing the triangles that have the least area.
const sPoints = simplify(areaOfTriangle, points, 10);
```

This implementation is not _opinionated_ about any particular vertex format, as long as associated the `weightFn` is
compatible.

```ts
type LngLat = [lng: number, lat: number, elevation?: number];

const areaOf = (triangle: [LngLat, LngLat, LngLat]) =>
  spherical.computeArea(triangle);

// Simplify out half the points of a polyline
const simplifiedPoints = simplify(
  areaOf,
  geodata.lineString,
  geodata.lineString / 2,
);
```

## More Info

- [Line Simplification](https://bost.ocks.org/mike/simplify/) by Mike Bostock.
- [Intersection Avoidance](https://www.jasondavies.com/simplify/) by Jason Davies.
