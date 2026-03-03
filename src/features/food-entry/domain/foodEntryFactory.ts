import type { FoodEntry, MealType, NutritionSnapshot } from "@/shared/types/core";
import { normalizeServingUnit } from "@/features/food-entry/domain/servingUnits";
import { normalizeFoodName } from "@/shared/utils/text";

export interface CreateFoodEntryInput {
  userId: string;
  foodName: string;
  mealType?: MealType;
  quantity: number;
  servingUnit: string;
  consumedAt: string;
  nutritionSnapshot: NutritionSnapshot;
}

const MEAL_TYPES: ReadonlySet<MealType> = new Set(["breakfast", "lunch", "dinner", "snack"]);

const createId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `entry_${Math.random().toString(36).slice(2, 11)}`;
};

export const createFoodEntry = (input: CreateFoodEntryInput): FoodEntry => {
  const foodName = input.foodName.trim();
  const servingUnit = normalizeServingUnit(input.servingUnit);
  const mealType = input.mealType ?? "snack";

  if (!foodName) {
    throw new Error("Food name is required.");
  }

  if (!servingUnit) {
    throw new Error("Serving unit is required.");
  }

  if (!Number.isFinite(input.quantity) || input.quantity <= 0) {
    throw new Error("Quantity must be greater than zero.");
  }

  if (!MEAL_TYPES.has(mealType)) {
    throw new Error("Meal type is invalid.");
  }

  return {
    id: createId(),
    userId: input.userId,
    foodName,
    normalizedFoodName: normalizeFoodName(foodName),
    mealType,
    quantity: input.quantity,
    servingUnit,
    consumedAt: input.consumedAt,
    nutritionSnapshot: input.nutritionSnapshot,
  };
};
