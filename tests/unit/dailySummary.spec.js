import { describe, expect, it } from "vitest";
import { LocalDailySummaryService } from "@/features/daily-summary/application/LocalDailySummaryService";
class StubFoodEntryRepository {
    constructor(entries) {
        this.entries = entries;
    }
    async save(entry) {
        this.entries.push(entry);
    }
    async update(entry) {
        const index = this.entries.findIndex((candidate) => candidate.id === entry.id);
        if (index >= 0) {
            this.entries[index] = entry;
        }
    }
    async deleteById(userId, entryId) {
        const index = this.entries.findIndex((candidate) => candidate.id === entryId && candidate.userId === userId);
        if (index >= 0) {
            this.entries.splice(index, 1);
        }
    }
    async listByDate(userId, _date) {
        return this.entries.filter((entry) => entry.userId === userId);
    }
}
class StubUserGoalRepository {
    constructor(goal) {
        this.goal = goal;
    }
    async getDailyCalorieGoal(_userId) {
        return this.goal;
    }
    async setDailyCalorieGoal(_userId, _calories) {
        return Promise.resolve();
    }
}
describe("LocalDailySummaryService", () => {
    it("computes calories, macros and goal delta", async () => {
        const entries = [
            {
                id: "1",
                userId: "u1",
                foodName: "banana",
                normalizedFoodName: "banana",
                mealType: "breakfast",
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
                mealType: "lunch",
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
        const service = new LocalDailySummaryService(new StubFoodEntryRepository(entries), new StubUserGoalRepository(2000));
        const summary = await service.forDate("u1", "2026-03-02");
        expect(summary.totalCalories).toBe(261);
        expect(summary.goalCalories).toBe(2000);
        expect(summary.goalDelta).toBe(1739);
        expect(summary.macroTotals.protein).toBe(13.9);
    });
    it("returns null goal values when user has not set target calories", async () => {
        const entries = [
            {
                id: "1",
                userId: "u1",
                foodName: "banana",
                normalizedFoodName: "banana",
                mealType: "snack",
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
        ];
        const service = new LocalDailySummaryService(new StubFoodEntryRepository(entries), new StubUserGoalRepository(null));
        const summary = await service.forDate("u1", "2026-03-02");
        expect(summary.goalCalories).toBeNull();
        expect(summary.goalDelta).toBeNull();
        expect(summary.insights).toMatch(/no target calories/i);
    });
});
