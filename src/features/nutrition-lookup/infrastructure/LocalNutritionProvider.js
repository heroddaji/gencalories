import { defaultNutritionCatalog } from "@/features/nutrition-lookup/domain/defaultNutritionCatalog";
import { normalizeServingUnit } from "@/shared/utils/serving";
import { normalizeFoodName, stringSimilarity } from "@/shared/utils/text";
const round = (value) => Math.round(value * 10) / 10;
const scaleNutrition = (base, quantity) => {
    return {
        calories: round(base.calories * quantity),
        protein: round(base.protein * quantity),
        carbs: round(base.carbs * quantity),
        fat: round(base.fat * quantity),
    };
};
const UNIT_TO_GRAMS = {
    g: 1,
    kg: 1000,
    ml: 1,
    l: 1000,
    oz: 28.35,
    tsp: 4.2,
    tbsp: 14.3,
    cup: 240,
};
const nutritionForMass = (per100g, grams) => {
    const factor = grams / 100;
    return scaleNutrition(per100g, factor);
};
const resolveGrams = (unit, quantity, food) => {
    const normalizedUnit = normalizeServingUnit(unit);
    const itemSpecific = food.gramsPerUnit?.[normalizedUnit];
    if (itemSpecific) {
        return quantity * itemSpecific;
    }
    if (normalizedUnit in UNIT_TO_GRAMS) {
        return quantity * UNIT_TO_GRAMS[normalizedUnit];
    }
    // For custom/unknown units, fall back to item's serving size when available.
    return quantity * (food.gramsPerUnit?.serving ?? 100);
};
const fallbackNutrition = (foodName) => {
    const normalized = normalizeFoodName(foodName);
    const length = Math.max(1, normalized.length);
    return {
        calories: 90 + length * 4,
        protein: round(4 + (length % 7) * 0.7),
        carbs: round(10 + (length % 10) * 1.8),
        fat: round(3 + (length % 5) * 0.8),
    };
};
export class LocalNutritionProvider {
    async resolveNutrition(input) {
        const quantity = Number.isFinite(input.quantity) && input.quantity > 0 ? input.quantity : 1;
        const normalizedName = normalizeFoodName(input.foodName);
        let bestMatch = null;
        let bestScore = -1;
        for (const item of defaultNutritionCatalog) {
            for (const alias of item.aliases) {
                const normalizedAlias = normalizeFoodName(alias);
                const score = Math.max(normalizedAlias === normalizedName ? 1 : 0, normalizedAlias.startsWith(normalizedName) ? 0.9 : 0, normalizedAlias.includes(normalizedName) ? 0.7 : 0, stringSimilarity(normalizedAlias, normalizedName));
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = item;
                }
            }
        }
        if (!bestMatch) {
            const base = fallbackNutrition(input.foodName);
            return scaleNutrition(base, quantity);
        }
        const grams = resolveGrams(input.unit, quantity, bestMatch);
        return nutritionForMass(bestMatch.per100g, grams);
    }
}
export class LocalFoodSearchProvider {
    async searchFoods(query, limit) {
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
            score: Math.max(candidate.normalized.startsWith(normalizedQuery) ? 1 : 0, candidate.normalized.includes(normalizedQuery) ? 0.8 : 0, stringSimilarity(candidate.normalized, normalizedQuery)),
        }))
            .filter((candidate) => candidate.score > 0)
            .sort((left, right) => right.score - left.score)
            .slice(0, limit)
            .map((candidate) => candidate.value);
        return matches;
    }
}
