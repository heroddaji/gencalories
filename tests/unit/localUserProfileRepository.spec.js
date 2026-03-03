import { describe, expect, it } from "vitest";
import { LocalUserProfileRepository } from "@/features/user-profile-goals/infrastructure/LocalUserProfileRepository";
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
describe("LocalUserProfileRepository", () => {
    it("returns empty profile when no data exists", async () => {
        const repository = new LocalUserProfileRepository(new InMemoryStorage());
        const profile = await repository.getProfile("u1");
        expect(profile).toEqual({
            age: null,
            heightCm: null,
            currentWeightKg: null,
            targetWeightKg: null,
        });
    });
    it("persists and normalizes profile fields", async () => {
        const repository = new LocalUserProfileRepository(new InMemoryStorage());
        await repository.saveProfile("u1", {
            age: 29.7,
            heightCm: 170.26,
            currentWeightKg: 75.54,
            targetWeightKg: -1,
        });
        const profile = await repository.getProfile("u1");
        expect(profile).toEqual({
            age: 30,
            heightCm: 170.3,
            currentWeightKg: 75.5,
            targetWeightKg: null,
        });
    });
});
