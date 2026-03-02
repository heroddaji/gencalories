import { describe, expect, it } from "vitest";
import { LocalDailySummaryService } from "@/features/daily-summary/application/LocalDailySummaryService";
import type {
  FoodEntryRepository,
  UserGoalRepository,
} from "@/app/di/contracts";
import type { FoodEntry } from "@/shared/types/core";

class StubFoodEntryRepository implements FoodEntryRepository {
  constructor(private readonly entries: FoodEntry[]) {}

  async save(entry: FoodEntry): Promise<void> {
    this.entries.push(entry);
  }

  async listByDate(_date: string): Promise<FoodEntry[]> {
    return this.entries;
  }
}

class StubUserGoalRepository implements UserGoalRepository {
  constructor(private readonly goal: number) {}

  async getDailyCalorieGoal(_userId: string): Promise<number> {
    return this.goal;
  }

  async setDailyCalorieGoal(_userId: string, _calories: number): Promise<void> {
    return Promise.resolve();
  }
}

describe("LocalDailySummaryService", () => {
  it("computes calories, macros and goal delta", async () => {
    const entries: FoodEntry[] = [
      {
        id: "1",
        userId: "u1",
        foodName: "banana",
        normalizedFoodName: "banana",
        quantity: 1,
        servingUnit: "serving",
        consumedAt: "2026-03-02T08:00:00.000Z",
        nutritionSnapshot: {
          calories: 105,
          protein: 1.3,
          carbs: 27,
          fat: 0.4,
        },
      },
      {
        id: "2",
        userId: "u1",
        foodName: "egg",
        normalizedFoodName: "egg",
        quantity: 2,
        servingUnit: "serving",
        consumedAt: "2026-03-02T12:00:00.000Z",
        nutritionSnapshot: {
          calories: 156,
          protein: 12.6,
          carbs: 1.2,
          fat: 10.6,
        },
      },
    ];

    const service = new LocalDailySummaryService(
      new StubFoodEntryRepository(entries),
      new StubUserGoalRepository(2000),
      "u1",
    );

    const summary = await service.forDate("2026-03-02");

    expect(summary.totalCalories).toBe(261);
    expect(summary.goalDelta).toBe(1739);
    expect(summary.macroTotals.protein).toBe(13.9);
  });
});
