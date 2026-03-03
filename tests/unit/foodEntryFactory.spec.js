import { describe, expect, it } from "vitest";
import { createFoodEntry } from "@/features/food-entry/domain/foodEntryFactory";
describe("createFoodEntry", () => {
    it("creates a normalized food entry", () => {
        const entry = createFoodEntry({
            userId: "user-1",
            foodName: "  Chicken, Breast  ",
            quantity: 1,
            servingUnit: " serving ",
            consumedAt: "2026-03-02T10:00:00.000Z",
            nutritionSnapshot: {
                calories: 165,
                protein: 31,
                carbs: 0,
                fat: 3.6,
            },
        });
        expect(entry.foodName).toBe("Chicken, Breast");
        expect(entry.normalizedFoodName).toBe("chicken breast");
        expect(entry.servingUnit).toBe("serving");
        expect(entry.mealType).toBe("snack");
    });
    it("normalizes known serving unit synonyms", () => {
        const entry = createFoodEntry({
            userId: "user-1",
            foodName: "banana",
            quantity: 1,
            servingUnit: " Grams ",
            consumedAt: "2026-03-02T10:00:00.000Z",
            nutritionSnapshot: {
                calories: 105,
                protein: 1.3,
                carbs: 27,
                fat: 0.4,
            },
        });
        expect(entry.servingUnit).toBe("g");
    });
    it("throws if quantity is invalid", () => {
        expect(() => createFoodEntry({
            userId: "user-1",
            foodName: "banana",
            quantity: 0,
            servingUnit: "serving",
            consumedAt: "2026-03-02T10:00:00.000Z",
            nutritionSnapshot: {
                calories: 105,
                protein: 1.3,
                carbs: 27,
                fat: 0.4,
            },
        })).toThrowError(/Quantity/);
    });
});
