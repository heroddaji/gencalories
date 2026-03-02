export const normalizeFoodName = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export const stringSimilarity = (a: string, b: string): number => {
  if (!a || !b) {
    return 0;
  }

  if (a === b) {
    return 1;
  }

  const aBigrams = new Set<string>();
  const bBigrams = new Set<string>();

  for (let index = 0; index < a.length - 1; index += 1) {
    aBigrams.add(a.slice(index, index + 2));
  }

  for (let index = 0; index < b.length - 1; index += 1) {
    bBigrams.add(b.slice(index, index + 2));
  }

  if (aBigrams.size === 0 || bBigrams.size === 0) {
    return 0;
  }

  let overlap = 0;
  aBigrams.forEach((token) => {
    if (bBigrams.has(token)) {
      overlap += 1;
    }
  });

  return (2 * overlap) / (aBigrams.size + bBigrams.size);
};
