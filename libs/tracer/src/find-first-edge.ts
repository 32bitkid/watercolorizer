import type { Vec2 } from '@4bitlabs/vec2';

export function findFirstEdge(
  data: Uint8ClampedArray,
  [width, height]: Vec2,
  emptyValue = 0,
): Vec2 | null {
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const left = x === 0 ? emptyValue : data[x - 1 + y * width];
      const right = data[x + y * width];
      if (left !== right) return [x, y];
    }

  return null;
}
