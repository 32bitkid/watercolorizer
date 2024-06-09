import { Vec2 } from '@4bitlabs/vec2';

import {
  convolution1D as conv1d,
  K_GAUSS_BLUR_5,
} from '@watercolorizer/convolution';

const minmax = (list: number[]): [min: number, max: number] =>
  list.reduce<[number, number]>(
    ([min, max], i) => [Math.min(min, i), Math.max(max, i)],
    [Infinity, -Infinity],
  );

export function randomWeights(points: Vec2[], floor: number = 0): number[] {
  const { length } = points;
  const initialWeights = Array.from({ length }, () => Math.random());

  const smoothed = conv1d(
    K_GAUSS_BLUR_5,
    initialWeights,
    Array.from<number>({ length }),
  );

  const [min, max] = minmax(smoothed);
  return smoothed
    .map((it) => (it - min) / (max - min))
    .map((it) => it * (1 - floor) + floor);
}
