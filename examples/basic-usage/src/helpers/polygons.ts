import { Vec2 } from '@4bitlabs/vec2';

export function pathPoly(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  points: Readonly<Vec2>[],
) {
  ctx.beginPath();
  const [first, ...rest] = points;
  ctx.moveTo(...first);
  rest.forEach(([x, y]) => ctx.lineTo(x, y));
  ctx.closePath();
}

export function* segmentsOf<T extends Vec2>(
  points: T[],
  looped: boolean,
): Generator<[T, T, number, number]> {
  const length = points.length;
  for (let i = 0; i < points.length - (looped ? 0 : 1); i++) {
    const next = (i + 1) % length;
    yield [points[i], points[next], i, next];
  }
}
