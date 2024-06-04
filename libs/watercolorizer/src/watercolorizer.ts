import { SimplifyAP as simplify } from 'simplify-ts';

import { Vec2 } from '@4bitlabs/vec2';
import { distortPolygon, DistortPolyOptions } from './distort-polygon';
import { PointsAndWeights } from './types';
import { simplifyWithWeights } from './simplify-with-weights';

const nReduce = <T>(
  length: number,
  fn: (prev: T, index: number) => T,
  initialValue: T,
) =>
  Array.from({ length }).reduce<T>(
    (prev, _, index) => fn(prev, index),
    initialValue,
  );

const ones = (length: number) => Array.from<number>({ length }).fill(1);

export interface WatercolorizeOptions {
  preEvolutions?: number;
  evolutions?: number;
  layersPerEvolution?: number;
  layerEvolutions?: number;
  vertexWeights?: number[];
  blurWeightsOnDistort?: boolean;
  simplifyAfterPreEvolution?: number | false;
  simplifyEachEvolution?: number | false;
}

export function* watercolorize(
  points: Vec2[],
  options: WatercolorizeOptions = {},
) {
  const {
    preEvolutions = 0,
    evolutions = 5,
    layersPerEvolution = 3,
    layerEvolutions = 3,
    vertexWeights = ones(points.length),
    blurWeightsOnDistort = false,
    simplifyAfterPreEvolution = 1,
    simplifyEachEvolution = false,
  } = options;

  const distortPolyOptions: DistortPolyOptions = { blurWeightsOnDistort };
  const distort = (_: PointsAndWeights) =>
    distortPolygon(_, distortPolyOptions);

  let prev: PointsAndWeights = [points, vertexWeights];
  prev = nReduce(preEvolutions, distort, prev);

  if (preEvolutions > 0 && simplifyAfterPreEvolution)
    prev = simplifyWithWeights(prev, simplifyAfterPreEvolution);

  // prev = preEvolutions > 0 ? simplify(prev, 4) : prev;

  for (let e = 0; e < evolutions; e++) {
    for (let l = 0; l < layersPerEvolution; l++) {
      const layer = nReduce<PointsAndWeights>(
        layerEvolutions,
        distort,
        distort(prev),
      );
      yield simplify(layer[0], 0.5);
    }
    prev = distort(prev);
    if (simplifyEachEvolution)
      prev = simplifyWithWeights(prev, simplifyEachEvolution);
  }
}
