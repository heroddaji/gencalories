import { isSameDateKey } from "@/shared/utils/date";
const STORAGE_KEY = "food_entries_v1";
const DEFAULT_USER_ID = "local-user";
const VALID_MEAL_TYPES = new Set(["breakfast", "lunch", "dinner", "snack"]);
export class LocalFoodEntryRepository {
    constructor(storage) {
        this.storage = storage;
    }
    async save(entry) {
        const entries = await this.readAll();
        entries.push(this.sanitizeEntry(entry));
        await this.writeAll(entries);
    }
    async update(entry) {
        const entries = await this.readAll();
        const index = entries.findIndex((candidate) => candidate.id === entry.id && candidate.userId === entry.userId);
        if (index < 0) {
            return;
        }
        entries[index] = this.sanitizeEntry(entry);
        await this.writeAll(entries);
    }
    async deleteById(userId, entryId) {
        const entries = await this.readAll();
        const filtered = entries.filter((entry) => !(entry.id === entryId && entry.userId === userId));
        if (filtered.length === entries.length) {
            return;
        }
        await this.writeAll(filtered);
    }
    async listByDate(userId, date) {
        const entries = await this.readAll();
        return entries.filter((entry) => entry.userId === userId && isSameDateKey(entry.consumedAt, date));
    }
    async readAll() {
        const raw = await this.storage.getItem(STORAGE_KEY);
        if (!raw) {
            return [];
        }
        try {
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) {
                return [];
            }
            return parsed.map((entry) => this.sanitizeEntry(entry));
        }
        catch {
            return [];
        }
    }
    sanitizeEntry(entry) {
        const mealType = VALID_MEAL_TYPES.has(entry.mealType) ? entry.mealType : "snack";
        return {
            ...entry,
            userId: entry.userId || DEFAULT_USER_ID,
            mealType,
        };
    }
    async writeAll(entries) {
        entries.sort((left, right) => new Date(right.consumedAt).getTime() - new Date(left.consumedAt).getTime());
        await this.storage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
}
