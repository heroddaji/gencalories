import { describe, expect, it } from "vitest";
import { LocalNutritionProvider } from "@/features/nutrition-lookup/infrastructure/LocalNutritionProvider";
describe("LocalNutritionProvider", () => {
    const provider = new LocalNutritionProvider();
    it("returns realistic calories for banana by serving and grams", async () => {
        const byServing = await provider.resolveNutrition({
            foodName: "banana",
            quantity: 1,
            unit: "serving",
        });
        const byGrams = await provider.resolveNutrition({
            foodName: "banana",
            quantity: 100,
            unit: "g",
        });
        expect(byServing.calories).toBe(105);
        expect(byGrams.calories).toBe(89);
    });
    it("applies serving-type conversion for cup-based foods", async () => {
        const riceCup = await provider.resolveNutrition({
            foodName: "white rice",
            quantity: 1,
            unit: "cup",
        });
        expect(riceCup.calories).toBe(205.4);
        expect(riceCup.carbs).toBe(44.6);
    });
    it("normalizes plural unit names", async () => {
        const gramsUnit = await provider.resolveNutrition({
            foodName: "chicken breast",
            quantity: 150,
            unit: "grams",
        });
        expect(gramsUnit.calories).toBe(247.5);
        expect(gramsUnit.protein).toBe(46.5);
    });
});
