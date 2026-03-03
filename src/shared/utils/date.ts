export const toDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const isSameDateKey = (isoDateTime: string, dateKey: string): boolean => {
  return toDateKey(new Date(isoDateTime)) === dateKey;
};

export const fromDateKey = (dateKey: string): Date => {
  const [year, month, day] = dateKey.split("-").map((value) => Number(value));
  return new Date(year, month - 1, day);
};

export const addDaysToDateKey = (dateKey: string, delta: number): string => {
  const date = fromDateKey(dateKey);
  date.setDate(date.getDate() + delta);
  return toDateKey(date);
};

export const formatDateLabel = (dateKey: string): string => {
  return fromDateKey(dateKey).toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const daysAgo = (fromIso: string, now = new Date()): number => {
  const value = new Date(fromIso).getTime();
  const deltaMs = Math.max(0, now.getTime() - value);
  return deltaMs / (1000 * 60 * 60 * 24);
};
