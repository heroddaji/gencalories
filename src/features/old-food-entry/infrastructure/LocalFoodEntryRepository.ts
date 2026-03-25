import type { FoodEntryRepository, StorageProvider } from "@/app/di/contracts";
import type { FoodEntry, MealType } from "@/shared/types/core";
import { isSameDateKey } from "@/shared/utils/date";

const STORAGE_KEY = "food_entries_v1";
const DEFAULT_USER_ID = "local-user";
const VALID_MEAL_TYPES: ReadonlySet<MealType> = new Set(["breakfast", "lunch", "dinner", "snack"]);

export class LocalFoodEntryRepository implements FoodEntryRepository {
  constructor(private readonly storage: StorageProvider) {}

  async save(entry: FoodEntry): Promise<void> {
    const entries = await this.readAll();
    entries.push(this.sanitizeEntry(entry));
    await this.writeAll(entries);
  }

  async update(entry: FoodEntry): Promise<void> {
    const entries = await this.readAll();
    const index = entries.findIndex(
      (candidate) => candidate.id === entry.id && candidate.userId === entry.userId,
    );

    if (index < 0) {
      return;
    }

    entries[index] = this.sanitizeEntry(entry);
    await this.writeAll(entries);
  }

  async deleteById(userId: string, entryId: string): Promise<void> {
    const entries = await this.readAll();
    const filtered = entries.filter(
      (entry) => !(entry.id === entryId && entry.userId === userId),
    );

    if (filtered.length === entries.length) {
      return;
    }

    await this.writeAll(filtered);
  }

  async listByDate(userId: string, date: string): Promise<FoodEntry[]> {
    const entries = await this.readAll();
    return entries.filter(
      (entry) => entry.userId === userId && isSameDateKey(entry.consumedAt, date),
    );
  }

  private async readAll(): Promise<FoodEntry[]> {
    const raw = await this.storage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as FoodEntry[];
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.map((entry) => this.sanitizeEntry(entry));
    } catch {
      return [];
    }
  }

  private sanitizeEntry(entry: FoodEntry): FoodEntry {
    const mealType = VALID_MEAL_TYPES.has(entry.mealType) ? entry.mealType : "snack";
    return {
      ...entry,
      userId: entry.userId || DEFAULT_USER_ID,
      mealType,
    };
  }

  private async writeAll(entries: FoodEntry[]): Promise<void> {
    entries.sort((left, right) => new Date(right.consumedAt).getTime() - new Date(left.consumedAt).getTime());
    await this.storage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }
}
