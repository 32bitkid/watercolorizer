import { Vec2, clone, add, isEqual } from '@4bitlabs/vec2';

import type { Ring } from './ring';

export enum Dir {
  up,
  down,
  left,
  right,
}

const steps: Record<Dir, Vec2> = {
  [Dir.up]: [0, -1],
  [Dir.down]: [0, 1],
  [Dir.left]: [-1, 0],
  [Dir.right]: [1, 0],
};

export interface WalkEdgeOptions {
  simplifyRuns?: boolean;
  turnPolicy?: 'ccw' | 'cw';
}

export function walkEdge(
  data: Uint8ClampedArray,
  size: Vec2,
  start: Vec2,
  options: WalkEdgeOptions = {},
): [ring: Ring, bounds: Vec2] {
  const { simplifyRuns = true, turnPolicy = 'ccw' } = options;

  const [width, height] = size;
  const result: Ring = [clone(start)];
  const cur = clone(start);

  const pixelAt = ([x, y]: Vec2) => {
    const oob = x < 0 || x >= width || y < 0 || y >= height;
    return oob ? 0 : data[x + y * width];
  };

  const quad = {
    tl: () => pixelAt(add([-1, -1], cur)),
    tr: () => pixelAt(add([0, -1], cur)),
    bl: () => pixelAt(add([-1, 0], cur)),
    br: () => pixelAt(cur),
  };

  let dir = Dir.down;
  add(steps[dir], cur, cur);

  const bounds: Vec2 = [0, 1];

  while (!isEqual(start, cur)) {
    let nextDir: Dir = dir;
    switch (dir) {
      case Dir.down: {
        const left = quad.bl();
        const right = quad.br();
        if (left === 0 && right !== 0) nextDir = Dir.down;
        else if (left !== 0 && right !== 0) nextDir = Dir.left;
        else if (left === 0 && right === 0) nextDir = Dir.right;
        else if (left !== 0 && right === 0)
          nextDir = turnPolicy === 'ccw' ? Dir.right : Dir.left;

        break;
      }
      case Dir.up: {
        const left = quad.tl();
        const right = quad.tr();
        if (left !== 0 && right === 0) nextDir = Dir.up;
        else if (left !== 0 && right !== 0) nextDir = Dir.right;
        else if (left === 0 && right === 0) nextDir = Dir.left;
        else if (left === 0 && right !== 0)
          nextDir = turnPolicy === 'ccw' ? Dir.left : Dir.right;
        break;
      }
      case Dir.left: {
        const top = quad.tl();
        const bottom = quad.bl();
        if (top === 0 && bottom !== 0) nextDir = Dir.left;
        else if (top !== 0 && bottom !== 0) nextDir = Dir.up;
        else if (top === 0 && bottom === 0) nextDir = Dir.down;
        else if (top !== 0 && bottom === 0)
          nextDir = turnPolicy === 'ccw' ? Dir.down : Dir.up;
        break;
      }
      case Dir.right: {
        const top = quad.tr();
        const bottom = quad.br();
        if (top !== 0 && bottom === 0) nextDir = Dir.right;
        else if (top !== 0 && bottom !== 0) nextDir = Dir.down;
        else if (top === 0 && bottom === 0) nextDir = Dir.up;
        else if (top === 0 && bottom !== 0)
          nextDir = turnPolicy === 'ccw' ? Dir.up : Dir.down;
        break;
      }
    }

    if (!simplifyRuns || nextDir !== dir) result.push(clone(cur));
    dir = nextDir;
    add(steps[dir], cur, cur);
    add([dir === Dir.left ? 1 : 0, dir === Dir.down ? 1 : 0], bounds, bounds);
  }

  return [result, bounds];
}
