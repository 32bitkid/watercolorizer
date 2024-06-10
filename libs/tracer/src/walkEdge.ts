import { add, clone, isEqual, Vec2, vec2 } from '@4bitlabs/vec2';

import type { Ring } from './ring';
import { Direction, UP, DOWN, LEFT, RIGHT } from './direction';

const directionVectors: { [key in Direction]: Vec2 } = {
  [UP]: vec2(0, -1),
  [DOWN]: vec2(0, 1),
  [LEFT]: vec2(-1, 0),
  [RIGHT]: vec2(1, 0),
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
): [ring: Ring, bounds: Vec2, steps: Direction[]] {
  const { simplifyRuns = true, turnPolicy = 'ccw' } = options;

  const [width, height] = size;
  const result: Ring = [];
  const steps: Direction[] = [];
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

  let dir: Direction = DOWN;
  result.push(clone(start));
  steps.push(dir);
  add(directionVectors[dir], cur, cur);

  const bounds: Vec2 = [0, 1];

  while (!isEqual(start, cur)) {
    let nextDir: Direction = dir;
    switch (dir) {
      case DOWN: {
        const left = quad.bl();
        const right = quad.br();
        if (left === 0 && right !== 0) nextDir = DOWN;
        else if (left !== 0 && right !== 0) nextDir = LEFT;
        else if (left === 0 && right === 0) nextDir = RIGHT;
        else if (left !== 0 && right === 0)
          nextDir = turnPolicy === 'ccw' ? RIGHT : LEFT;

        break;
      }
      case UP: {
        const left = quad.tl();
        const right = quad.tr();
        if (left !== 0 && right === 0) nextDir = UP;
        else if (left !== 0 && right !== 0) nextDir = RIGHT;
        else if (left === 0 && right === 0) nextDir = LEFT;
        else if (left === 0 && right !== 0)
          nextDir = turnPolicy === 'ccw' ? LEFT : RIGHT;
        break;
      }
      case LEFT: {
        const top = quad.tl();
        const bottom = quad.bl();
        if (top === 0 && bottom !== 0) nextDir = LEFT;
        else if (top !== 0 && bottom !== 0) nextDir = UP;
        else if (top === 0 && bottom === 0) nextDir = DOWN;
        else if (top !== 0 && bottom === 0)
          nextDir = turnPolicy === 'ccw' ? DOWN : UP;
        break;
      }
      case RIGHT: {
        const top = quad.tr();
        const bottom = quad.br();
        if (top !== 0 && bottom === 0) nextDir = RIGHT;
        else if (top !== 0 && bottom !== 0) nextDir = DOWN;
        else if (top === 0 && bottom === 0) nextDir = UP;
        else if (top === 0 && bottom !== 0)
          nextDir = turnPolicy === 'ccw' ? UP : DOWN;
        break;
      }
    }

    if (!simplifyRuns || nextDir !== dir) {
      result.push(clone(cur));
      steps.push(dir);
    }
    dir = nextDir;
    add(directionVectors[dir], cur, cur);
    add([dir === LEFT ? 1 : 0, dir === DOWN ? 1 : 0], bounds, bounds);
  }

  return [result, bounds, steps];
}
