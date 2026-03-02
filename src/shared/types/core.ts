export interface MacroTotals {
  protein: number;
  carbs: number;
  fat: number;
}

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
  goalDelta: number;
  insights: string;
}
