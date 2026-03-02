export const toDateKey = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};

export const isSameDateKey = (isoDateTime: string, dateKey: string): boolean => {
  return isoDateTime.slice(0, 10) === dateKey;
};

export const daysAgo = (fromIso: string, now = new Date()): number => {
  const value = new Date(fromIso).getTime();
  const deltaMs = Math.max(0, now.getTime() - value);
  return deltaMs / (1000 * 60 * 60 * 24);
};
