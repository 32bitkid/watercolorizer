export type RandomNumberGenerator = () => number;

export type GaussianRngFn = (μ?: number, σ?: number) => number;

export function createGaussianRng(rand: RandomNumberGenerator): GaussianRngFn {
  return function gaussRng(μ: number = 0, σ: number = 1) {
    const u = 1 - rand();
    const v = rand();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * σ + μ;
  };
}

export const unsafeGaussRng: GaussianRngFn = createGaussianRng(Math.random);
