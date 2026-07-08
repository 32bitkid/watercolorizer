import type { Vec2 } from '@4bitlabs/vec2';
import { type ISimplifyArrayPoint, SimplifyAP } from 'simplify-ts';

export const simplify = (
  points: Vec2[],
  tolerance?: number,
  highestQuality?: boolean,
): Vec2[] =>
  SimplifyAP(
    points as unknown as ISimplifyArrayPoint[],
    tolerance,
    highestQuality,
  );
