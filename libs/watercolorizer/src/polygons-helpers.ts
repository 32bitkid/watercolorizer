export type Segment<T> = [a: T, b: T, aIdx: number, bIdx: number];

export function* segments<T>(points: T[]): Generator<Segment<T>> {
  const length = points.length;
  for (let i = 0; i < length; i++) {
    const next = (i + 1) % length;
    yield [points[i], points[next], i, next];
  }
}

export type Triplet<T> = [previous: T, self: T, next: T, idx: number];

export function* triplets<T>(points: T[]): IterableIterator<Triplet<T>> {
  const length = points.length;
  for (let i = 0; i < length; i++) {
    const prev = (i - 1 + length) % length;
    const next = (i + 1) % length;
    yield [points[prev], points[i], points[next], i];
  }
}
