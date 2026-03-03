import { describe, expect, it } from "vitest";
import { rankSuggestions } from "@/features/food-history-suggestions/domain/suggestionRanking";
const baseNow = new Date("2026-03-01T10:00:00.000Z");
const item = (normalizedName, options = {}) => ({
    normalizedName,
    displayName: options.displayName ?? normalizedName,
    lastUsedAt: options.lastUsedAt ?? baseNow.toISOString(),
    useCount: options.useCount ?? 1,
    recentServing: options.recentServing ?? { quantity: 1, unit: "serving" },
});
describe("rankSuggestions", () => {
    it("prioritizes prefix and recency", () => {
        const results = rankSuggestions("chick", [
            item("chicken breast", { lastUsedAt: "2026-02-28T10:00:00.000Z", useCount: 4 }),
            item("roast chicken", { lastUsedAt: "2025-11-01T10:00:00.000Z", useCount: 30 }),
        ], 5);
        expect(results[0]?.normalizedName).toBe("chicken breast");
    });
    it("returns recent list when query is empty", () => {
        const results = rankSuggestions("", [
            item("banana", { lastUsedAt: "2026-02-20T10:00:00.000Z" }),
            item("apple", { lastUsedAt: "2026-02-28T10:00:00.000Z" }),
        ], 2);
        expect(results.map((entry) => entry.normalizedName)).toEqual(["apple", "banana"]);
    });
});
