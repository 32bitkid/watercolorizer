import {
  add,
  clone,
  isEqual,
  type MutableVec2,
  type Vec2,
  vec2,
} from '@4bitlabs/vec2';
import { type Direction, DOWN, LEFT, RIGHT, UP } from './direction.js';
import type { Ring } from './ring.js';

const directionVectors: { [key in Direction]: Vec2 } = {
  [UP]: vec2(0, -1),
  [DOWN]: vec2(0, 1),
  [LEFT]: vec2(-1, 0),
  [RIGHT]: vec2(1, 0),
};

export interface WalkEdgeOptions {
  simplifyRuns?: boolean;
  turnPolicy?: 'ccw' | 'cw';
  emptyValue?: number;
}

export function walkEdge(
  data: Uint8ClampedArray,
  size: Vec2,
  start: Vec2,
  options: WalkEdgeOptions = {},
): [ring: Ring, bounds: Vec2, steps: Direction[]] {
  const {
    simplifyRuns = true,
    turnPolicy: turns = 'ccw',
    emptyValue: empty,
  } = options;

  const [width, height] = size;
  const result: Ring = [];
  const steps: Direction[] = [];
  const cur = clone(start);

  const pixelAt = ([x, y]: Vec2) => {
    const oob = x < 0 || x >= width || y < 0 || y >= height;
    return oob ? 0 : data[x + y * width];
  };

  const isEmpty = {
    tl: () => pixelAt(add([-1, -1], cur)) === empty,
    tr: () => pixelAt(add([0, -1], cur)) === empty,
    bl: () => pixelAt(add([-1, 0], cur)) === empty,
    br: () => pixelAt(cur) === empty,
  };

  const isCCW = turns === 'ccw';

  let dir: Direction = isCCW ? DOWN : RIGHT;
  result.push(clone(start));
  steps.push(dir);
  add(directionVectors[dir], cur, cur);

  const bounds: MutableVec2 = [0, 1];

  while (!isEqual(start, cur)) {
    let nextDir: Direction = dir;

    switch (dir) {
      case DOWN: {
        const int = isCCW ? isEmpty.br() : isEmpty.bl();
        const ext = isCCW ? isEmpty.bl() : isEmpty.br();

        if (ext && !int) nextDir = DOWN;
        else if (ext && int) nextDir = isCCW ? RIGHT : LEFT;
        else nextDir = isCCW ? LEFT : RIGHT;
        break;
      }
      case RIGHT: {
        const int = isCCW ? isEmpty.tr() : isEmpty.br();
        const ext = isCCW ? isEmpty.br() : isEmpty.tr();

        if (ext && !int) nextDir = RIGHT;
        else if (ext && int) nextDir = isCCW ? UP : DOWN;
        else nextDir = isCCW ? DOWN : UP;
        break;
      }
      case UP: {
        const int = isCCW ? isEmpty.tl() : isEmpty.tr();
        const ext = isCCW ? isEmpty.tr() : isEmpty.tl();

        if (ext && !int) nextDir = UP;
        else if (ext && int) nextDir = isCCW ? LEFT : RIGHT;
        else nextDir = isCCW ? RIGHT : LEFT;
        break;
      }
      case LEFT: {
        const int = isCCW ? isEmpty.bl() : isEmpty.tl();
        const ext = isCCW ? isEmpty.tl() : isEmpty.bl();

        if (ext && !int) nextDir = LEFT;
        else if (ext && int) nextDir = isCCW ? DOWN : UP;
        else nextDir = isCCW ? UP : DOWN;
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
