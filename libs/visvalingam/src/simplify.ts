import { pop, push, replace } from 'mnemonist/heap';

export type Triplet<T> = [T, T, T];

export function* triplets<T>(points: T[]): IterableIterator<Triplet<T>> {
  for (let i = 1; i < points.length - 1; i++) {
    yield [points[i - 1], points[i], points[i + 1]];
  }
}

export type WeightFn<T> = (triplet: Triplet<T>) => number;

interface Entry<T> {
  readonly t: Triplet<T>;
  readonly weight: number;
  dead: boolean;
}

const weightCmp = <T>(a: Entry<T>, b: Entry<T>) => a.weight - b.weight;

type LimitFn = (weight: number) => boolean;

export function simplify<T extends object>(
  weightFn: WeightFn<T>,
  points: T[],
  limit: number | LimitFn,
): T[] {
  const initialCount = points.length;
  if (initialCount < 3) return points;
  if (typeof limit === 'number' && initialCount < limit) return points;
  if (typeof limit === 'number' && limit < 3)
    return [points[0], points[initialCount - 1]];

  const countLimit = typeof limit === 'number' ? limit : 2;
  const limitFn = typeof limit === 'number' ? null : limit;

  const heap: Entry<T>[] = [];
  const forward = new WeakMap<Entry<T>, Entry<T>>();
  const backward = new WeakMap<Entry<T>, Entry<T>>();

  // Build
  {
    let previous = null;
    for (const t of triplets(points)) {
      const entry: Entry<T> = {
        t,
        weight: weightFn(t),
        dead: false,
      };
      if (previous) {
        forward.set(previous, entry);
        backward.set(entry, previous);
      }
      previous = entry;
      push(weightCmp, heap, entry);
    }
  }

  // Cull
  let pointsLeft = initialCount - countLimit;
  const removed = new WeakSet<T>();
  while (pointsLeft > 0) {
    const current = pop(weightCmp, heap);
    if (!current) throw new Error('unexpected heap exhaustion');
    if (current.dead) continue;

    if (!isFinite(current.weight)) break;
    if (limitFn && !limitFn(current.weight)) break;

    removed.add(current.t[1]);
    pointsLeft -= 1;

    // update neighbors
    const previous = backward.get(current);
    const next = forward.get(current);
    let newPrevious = null;
    let newNext = null;

    if (previous) {
      previous.dead = true;
      const [a, b] = previous.t;
      const [, , c] = current.t;
      const updatedT: Triplet<T> = [a, b, c];
      newPrevious = {
        t: updatedT,
        weight: weightFn(updatedT),
        dead: false,
      };

      const prevPrev = backward.get(previous);
      if (prevPrev) {
        forward.set(prevPrev, newPrevious);
        backward.set(newPrevious, prevPrev);
      }

      if (heap[0].dead) replace(weightCmp, heap, newPrevious);
      else push(weightCmp, heap, newPrevious);
    }

    if (next) {
      next.dead = true; // mark as dead
      const [, b, c] = next.t;
      const [a] = current.t;
      const updatedT: Triplet<T> = [a, b, c];
      newNext = {
        t: updatedT,
        weight: weightFn(updatedT),
        dead: false,
      };

      const nextNext = forward.get(next);
      if (nextNext) {
        backward.set(nextNext, newNext);
        forward.set(newNext, nextNext);
      }

      if (heap[0].dead) replace(weightCmp, heap, newNext);
      else push(weightCmp, heap, newNext);
    }

    if (newNext && newPrevious) {
      forward.set(newPrevious, newNext);
      backward.set(newNext, newPrevious);
    }
  }

  // Collect
  return points.filter((it) => !removed.has(it));
}
