import { describe, expect, it } from "vitest";
import type {
  FoodEntryRepository,
  NutritionProvider,
} from "@/app/di/contracts";
import { UpdateFoodEntryUseCase } from "@/features/food-entry/application/UpdateFoodEntryUseCase";
import type { FoodEntry, NutritionSnapshot } from "@/shared/types/core";

class StubNutritionProvider implements NutritionProvider {
  constructor(private readonly snapshot: NutritionSnapshot) {}

  async resolveNutrition(): Promise<NutritionSnapshot> {
    return this.snapshot;
  }
}

class StubFoodEntryRepository implements FoodEntryRepository {
  public updated: FoodEntry | null = null;

  async save(): Promise<void> {
    return Promise.resolve();
  }

  async update(entry: FoodEntry): Promise<void> {
    this.updated = entry;
  }

  async deleteById(): Promise<void> {
    return Promise.resolve();
  }

  async listByDate(): Promise<FoodEntry[]> {
    return [];
  }
}

describe("UpdateFoodEntryUseCase", () => {
  it("recomputes nutrition and persists updated quantity/unit", async () => {
    const repository = new StubFoodEntryRepository();
    const useCase = new UpdateFoodEntryUseCase(
      new StubNutritionProvider({
        calories: 220,
        protein: 12,
        carbs: 18,
        fat: 9,
      }),
      repository,
    );

    const entry: FoodEntry = {
      id: "entry-1",
      userId: "local-user",
      foodName: "oats",
      normalizedFoodName: "oats",
      mealType: "breakfast",
      quantity: 1,
      servingUnit: "serving",
      consumedAt: "2026-03-03T08:00:00.000+11:00",
      nutritionSnapshot: {
        calories: 120,
        protein: 5,
        carbs: 20,
        fat: 3,
      },
    };

    const updated = await useCase.execute({
      entry,
      quantity: 2,
      servingUnit: "cup",
    });

    expect(updated.quantity).toBe(2);
    expect(updated.servingUnit).toBe("cup");
    expect(updated.nutritionSnapshot.calories).toBe(220);
    expect(repository.updated?.id).toBe("entry-1");
    expect(repository.updated?.quantity).toBe(2);
  });
});
