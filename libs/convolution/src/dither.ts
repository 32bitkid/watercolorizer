export type DitherFunction = (x: number, y: number, val: number) => number;

const noDither: DitherFunction = (_x: number, _y: number, val: number) => val;
const createRandomDither =
  (rng: () => number): DitherFunction =>
  (_x: number, _y: number, value: number) => {
    const int = Math.floor(value);
    const frac = value - int;
    return int + (rng() <= frac ? 0 : 1);
  };

export type NoneDitherOptions = { type: 'none' };
export type RandomDitherOptions = { type: 'random'; rng?: () => number };
export type DitherOptions = NoneDitherOptions | RandomDitherOptions;

export function getDitherFn(ditherOptions: DitherOptions): DitherFunction {
  return ditherOptions.type === 'none'
    ? noDither
    : createRandomDither(ditherOptions.rng ?? Math.random);
}
