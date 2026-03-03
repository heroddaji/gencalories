import { describe, expect, it } from "vitest";
import { LocalFoodEntryRepository } from "@/features/food-entry/infrastructure/LocalFoodEntryRepository";
class InMemoryStorage {
    constructor() {
        this.map = new Map();
    }
    async getItem(key) {
        return this.map.get(key) ?? null;
    }
    async setItem(key, value) {
        this.map.set(key, value);
    }
    async removeItem(key) {
        this.map.delete(key);
    }
}
const sampleEntry = (overrides = {}) => ({
    id: overrides.id ?? "entry-1",
    userId: overrides.userId ?? "local-user",
    foodName: overrides.foodName ?? "banana",
    normalizedFoodName: overrides.normalizedFoodName ?? "banana",
    mealType: overrides.mealType ?? "breakfast",
    quantity: overrides.quantity ?? 1,
    servingUnit: overrides.servingUnit ?? "serving",
    consumedAt: overrides.consumedAt ?? "2026-03-03T08:00:00.000+11:00",
    nutritionSnapshot: overrides.nutritionSnapshot ?? {
        calories: 105,
        protein: 1.3,
        carbs: 27,
        fat: 0.4,
    },
});
describe("LocalFoodEntryRepository", () => {
    it("stores and filters entries by user + date", async () => {
        const repository = new LocalFoodEntryRepository(new InMemoryStorage());
        await repository.save(sampleEntry({ id: "a", userId: "u1" }));
        await repository.save(sampleEntry({ id: "b", userId: "u2" }));
        await repository.save(sampleEntry({
            id: "c",
            userId: "u1",
            consumedAt: "2026-03-04T08:00:00.000+11:00",
        }));
        const results = await repository.listByDate("u1", "2026-03-03");
        expect(results.map((entry) => entry.id)).toEqual(["a"]);
    });
    it("updates and deletes entries", async () => {
        const repository = new LocalFoodEntryRepository(new InMemoryStorage());
        const entry = sampleEntry({ id: "update-me", userId: "u1", quantity: 1 });
        await repository.save(entry);
        await repository.update({
            ...entry,
            quantity: 3,
            servingUnit: "g",
        });
        const updated = await repository.listByDate("u1", "2026-03-03");
        expect(updated[0]?.quantity).toBe(3);
        expect(updated[0]?.servingUnit).toBe("g");
        await repository.deleteById("u1", "update-me");
        const afterDelete = await repository.listByDate("u1", "2026-03-03");
        expect(afterDelete).toHaveLength(0);
    });
});
