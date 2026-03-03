import { normalizeServingUnit } from "@/features/food-entry/domain/servingUnits";
import { normalizeFoodName } from "@/shared/utils/text";
const MEAL_TYPES = new Set(["breakfast", "lunch", "dinner", "snack"]);
const createId = () => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }
    return `entry_${Math.random().toString(36).slice(2, 11)}`;
};
export const createFoodEntry = (input) => {
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
