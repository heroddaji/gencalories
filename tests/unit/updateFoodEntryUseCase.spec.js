import { describe, expect, it } from "vitest";
import { UpdateFoodEntryUseCase } from "@/features/food-entry/application/UpdateFoodEntryUseCase";
class StubNutritionProvider {
    constructor(snapshot) {
        this.snapshot = snapshot;
    }
    async resolveNutrition() {
        return this.snapshot;
    }
}
class StubFoodEntryRepository {
    constructor() {
        this.updated = null;
    }
    async save() {
        return Promise.resolve();
    }
    async update(entry) {
        this.updated = entry;
    }
    async deleteById() {
        return Promise.resolve();
    }
    async listByDate() {
        return [];
    }
}
describe("UpdateFoodEntryUseCase", () => {
    it("recomputes nutrition and persists updated quantity/unit", async () => {
        const repository = new StubFoodEntryRepository();
        const useCase = new UpdateFoodEntryUseCase(new StubNutritionProvider({
            calories: 220,
            protein: 12,
            carbs: 18,
            fat: 9,
        }), repository);
        const entry = {
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
