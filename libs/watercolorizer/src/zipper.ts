export function* zipper<T>(...sources: T[][]) {
  const longest = sources.reduce(
    (prev, { length }) => (length > prev ? length : prev),
    0,
  );

  for (let i = 0; i < longest; i++)
    for (let s = 0; s < sources.length; s++) {
      if (i < sources[s].length) yield sources[s][i];
    }
}
