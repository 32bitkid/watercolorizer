import { Triplet } from './simplify';

type PointTuple = [number, number];
export const areaOfTuple = ([
  [x0, y0],
  [x1, y1],
  [x2, y2],
]: Triplet<PointTuple>) =>
  Math.abs((x0 - x2) * (y1 - y0) - (x0 - x1) * (y2 - y0));

type PointObject = { x: number; y: number };
export const areaOfObject = ([
  { x: x0, y: y0 },
  { x: x1, y: y1 },
  { x: x2, y: y2 },
]: Triplet<PointObject>) =>
  Math.abs((x0 - x2) * (y1 - y0) - (x0 - x1) * (y2 - y0));
