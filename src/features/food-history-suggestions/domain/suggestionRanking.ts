import type { FoodHistoryItem } from "@/shared/types/core";
import { daysAgo } from "@/shared/utils/date";
import { normalizeFoodName, stringSimilarity } from "@/shared/utils/text";

const PREFIX_WEIGHT = 0.45;
const FUZZY_WEIGHT = 0.25;
const RECENCY_WEIGHT = 0.2;
const FREQUENCY_WEIGHT = 0.1;

const MAX_RECENCY_DAYS = 30;

const prefixScore = (query: string, value: string): number => {
  if (!query) {
    return 0;
  }

  if (value.startsWith(query)) {
    return 1;
  }

  if (value.includes(query)) {
    return 0.5;
  }

  return 0;
};

const recencyScore = (lastUsedAt: string): number => {
  const age = daysAgo(lastUsedAt);
  if (age >= MAX_RECENCY_DAYS) {
    return 0;
  }

  return 1 - age / MAX_RECENCY_DAYS;
};

const frequencyScore = (useCount: number): number => {
  return Math.min(1, Math.log10(useCount + 1));
};

export const rankSuggestions = (
  query: string,
  items: FoodHistoryItem[],
  limit: number,
): FoodHistoryItem[] => {
  const normalizedQuery = normalizeFoodName(query);

  if (!normalizedQuery) {
    return items
      .slice()
      .sort((a, b) => new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime())
      .slice(0, limit);
  }

  return items
    .map((item) => {
      const prefix = prefixScore(normalizedQuery, item.normalizedName);
      const fuzzy = stringSimilarity(normalizedQuery, item.normalizedName);
      const recency = recencyScore(item.lastUsedAt);
      const frequency = frequencyScore(item.useCount);

      const score =
        prefix * PREFIX_WEIGHT +
        fuzzy * FUZZY_WEIGHT +
        recency * RECENCY_WEIGHT +
        frequency * FREQUENCY_WEIGHT;

      return { item, score };
    })
    .filter((value) => value.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map((value) => value.item);
};
