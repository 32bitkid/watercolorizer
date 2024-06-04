export function* zipper<T>(zip: T[], ...other: T[][]) {
  const length = zip.length;

  const sources = [zip, ...other];
  for (let i = 0; i < length - 1; i++)
    for (let s = 0; s < sources.length; s++) {
      if (i < sources[s].length) yield sources[s][i];
    }

  yield zip[length - 1];
}
