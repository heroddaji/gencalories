import type { FoodSearchProvider, NutritionProvider } from "@/app/di/contracts";
import { defaultNutritionCatalog } from "@/features/nutrition-lookup/domain/defaultNutritionCatalog";
import type { NutritionSnapshot } from "@/shared/types/core";
import { normalizeFoodName, stringSimilarity } from "@/shared/utils/text";

const round = (value: number): number => Math.round(value * 10) / 10;

const scaleNutrition = (base: NutritionSnapshot, quantity: number): NutritionSnapshot => {
  return {
    calories: round(base.calories * quantity),
    protein: round(base.protein * quantity),
    carbs: round(base.carbs * quantity),
    fat: round(base.fat * quantity),
  };
};

const fallbackNutrition = (foodName: string): NutritionSnapshot => {
  const normalized = normalizeFoodName(foodName);
  const length = Math.max(1, normalized.length);
  return {
    calories: 90 + length * 4,
    protein: round(4 + (length % 7) * 0.7),
    carbs: round(10 + (length % 10) * 1.8),
    fat: round(3 + (length % 5) * 0.8),
  };
};

export class LocalNutritionProvider implements NutritionProvider {
  async resolveNutrition(input: {
    foodName: string;
    quantity: number;
    unit: string;
  }): Promise<NutritionSnapshot> {
    void input.unit;
    const quantity = Number.isFinite(input.quantity) && input.quantity > 0 ? input.quantity : 1;
    const normalizedName = normalizeFoodName(input.foodName);

    let bestMatch: NutritionSnapshot | null = null;
    let bestScore = -1;

    defaultNutritionCatalog.forEach((item) => {
      item.aliases.forEach((alias) => {
        const normalizedAlias = normalizeFoodName(alias);
        const score = Math.max(
          normalizedAlias === normalizedName ? 1 : 0,
          normalizedAlias.startsWith(normalizedName) ? 0.9 : 0,
          normalizedAlias.includes(normalizedName) ? 0.7 : 0,
          stringSimilarity(normalizedAlias, normalizedName),
        );

        if (score > bestScore) {
          bestScore = score;
          bestMatch = item.perServing;
        }
      });
    });

    const base = bestMatch ?? fallbackNutrition(input.foodName);
    return scaleNutrition(base, quantity);
  }
}

export class LocalFoodSearchProvider implements FoodSearchProvider {
  async searchFoods(query: string, limit: number): Promise<string[]> {
    const normalizedQuery = normalizeFoodName(query);
    if (!normalizedQuery) {
      return defaultNutritionCatalog
        .slice(0, limit)
        .map((item) => item.aliases[0]);
    }

    const matches = defaultNutritionCatalog
      .map((item) => item.aliases[0])
      .map((value) => ({
        value,
        normalized: normalizeFoodName(value),
      }))
      .map((candidate) => ({
        value: candidate.value,
        score: Math.max(
          candidate.normalized.startsWith(normalizedQuery) ? 1 : 0,
          candidate.normalized.includes(normalizedQuery) ? 0.8 : 0,
          stringSimilarity(candidate.normalized, normalizedQuery),
        ),
      }))
      .filter((candidate) => candidate.score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, limit)
      .map((candidate) => candidate.value);

    return matches;
  }
}
