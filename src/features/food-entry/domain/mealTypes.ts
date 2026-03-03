import type { MealType } from "@/shared/types/core";

export const mealTypeOrder: ReadonlyArray<MealType> = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
];

export const mealTypeLabels: Readonly<Record<MealType, string>> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snacks",
};

export const isMealType = (value: string): value is MealType => {
  return mealTypeOrder.includes(value as MealType);
};
