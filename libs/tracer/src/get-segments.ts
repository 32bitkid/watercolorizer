import { Vec2 } from '@4bitlabs/vec2';

export function* getSegments<T extends Vec2>(
  points: T[],
  looped: boolean,
): Generator<[T, T, number, number]> {
  const length = points.length;
  for (let i = 0; i < points.length - (looped ? 0 : 1); i++) {
    const next = (i + 1) % length;
    yield [points[i], points[next], i, next];
  }
}
