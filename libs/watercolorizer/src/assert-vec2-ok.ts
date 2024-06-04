import { Vec2 } from '@4bitlabs/vec2';

const warnLater = (message: string) => {
  let existing = 0;
  let count = 0;
  return () => {
    count += 1;
    if (!existing) {
      existing = requestAnimationFrame(() => {
        console.warn(`${message}: ${count} times…`);
        existing = 0;
        count = 0;
      });
    }
  };
};

const warning = warnLater('bad maths!');

export const assertOK = (it: Vec2[]) => {
  for (const [x, y] of it) {
    if (isNaN(x) || isNaN(y)) warning();
  }
  return it;
};
