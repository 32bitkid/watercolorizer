import { Vec2 } from '@4bitlabs/vec2';

export const getBounds = (poly: Vec2[]): [...Vec2, ...Vec2] =>
  poly.reduce(
    (state, vec) => {
      state[0] = Math.min(state[0], vec[0]);
      state[1] = Math.min(state[1], vec[1]);
      state[2] = Math.max(state[2], vec[0]);
      state[3] = Math.max(state[3], vec[1]);
      return state;
    },
    [Infinity, Infinity, -Infinity, -Infinity],
  );
