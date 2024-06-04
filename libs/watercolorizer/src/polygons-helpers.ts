import { Vec2 } from '@4bitlabs/vec2';

export function* segments<T extends Vec2>(
  points: T[],
  looped: boolean,
): Generator<[T, T, number, number]> {
  const length = points.length;
  for (let i = 0; i < points.length - (looped ? 0 : 1); i++) {
    const next = (i + 1) % length;
    yield [points[i], points[next], i, next];
  }
}

export function* triplets(
  points: Vec2[],
  looped: boolean,
): IterableIterator<[Vec2, Vec2, Vec2, number]> {
  for (let i = looped ? 0 : 1; i < points.length - (looped ? 0 : 1); i++) {
    const prev = (i - 1 + points.length) % points.length;
    const next = (i + 1) % points.length;
    yield [points[prev], points[i], points[next], i];
  }
}
