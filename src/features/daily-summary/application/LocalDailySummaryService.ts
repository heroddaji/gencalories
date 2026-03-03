import type {
  DailySummaryService,
  FoodEntryRepository,
  UserGoalRepository,
} from "@/app/di/contracts";
import type { DailyConsumptionSummary, MacroTotals } from "@/shared/types/core";

const summarizeInsight = (totalCalories: number, goalDelta: number | null): string => {
  if (totalCalories === 0) {
    if (goalDelta === null) {
      return "No foods logged yet today. Set a daily calorie target to track progress.";
    }

    return "No foods logged yet today. Start by adding your first meal.";
  }

  if (goalDelta === null) {
    return "You have no target calories set yet. Go to Profile to set your daily goal.";
  }

  if (goalDelta > 0) {
    return `You are ${Math.round(goalDelta)} kcal under goal. Keep your momentum going.`;
  }

  if (goalDelta < 0) {
    return `You are ${Math.abs(Math.round(goalDelta))} kcal above goal. Consider a lighter next meal.`;
  }

  return "You hit your calorie goal exactly today. Great balance!";
};

export class LocalDailySummaryService implements DailySummaryService {
  constructor(
    private readonly entryRepository: FoodEntryRepository,
    private readonly goalRepository: UserGoalRepository,
    private readonly userId: string,
  ) {}

  async forDate(date: string): Promise<DailyConsumptionSummary> {
    const entries = await this.entryRepository.listByDate(date);
    const calorieGoal = await this.goalRepository.getDailyCalorieGoal(this.userId);

    const macroTotals = entries.reduce<MacroTotals>(
      (accumulator, entry) => {
        accumulator.protein += entry.nutritionSnapshot.protein;
        accumulator.carbs += entry.nutritionSnapshot.carbs;
        accumulator.fat += entry.nutritionSnapshot.fat;
        return accumulator;
      },
      { protein: 0, carbs: 0, fat: 0 },
    );

    const totalCalories = entries.reduce(
      (accumulator, entry) => accumulator + entry.nutritionSnapshot.calories,
      0,
    );

    const goalDelta = calorieGoal === null ? null : calorieGoal - totalCalories;

    return {
      date,
      totalCalories: Math.round(totalCalories),
      macroTotals: {
        protein: Math.round(macroTotals.protein * 10) / 10,
        carbs: Math.round(macroTotals.carbs * 10) / 10,
        fat: Math.round(macroTotals.fat * 10) / 10,
      },
      goalCalories: calorieGoal === null ? null : Math.round(calorieGoal),
      goalDelta: goalDelta === null ? null : Math.round(goalDelta),
      insights: summarizeInsight(totalCalories, goalDelta),
    };
  }
}
