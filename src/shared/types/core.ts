export interface MacroTotals {
  protein: number;
  carbs: number;
  fat: number;
}

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface NutritionSnapshot extends MacroTotals {
  calories: number;
}

export interface Serving {
  quantity: number;
  unit: string;
}

export interface FoodEntry {
  id: string;
  userId: string;
  foodName: string;
  normalizedFoodName: string;
  mealType: MealType;
  quantity: number;
  servingUnit: string;
  consumedAt: string;
  nutritionSnapshot: NutritionSnapshot;
}

export interface FoodHistoryItem {
  normalizedName: string;
  displayName: string;
  lastUsedAt: string;
  useCount: number;
  recentServing: Serving;
}

export interface DailyConsumptionSummary {
  date: string;
  totalCalories: number;
  macroTotals: MacroTotals;
  goalCalories: number | null;
  goalDelta: number | null;
  insights: string;
}

export interface UserProfile {
  age: number | null;
  heightCm: number | null;
  currentWeightKg: number | null;
  targetWeightKg: number | null;
}
