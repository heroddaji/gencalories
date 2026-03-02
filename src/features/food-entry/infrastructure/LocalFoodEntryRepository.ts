import type { FoodEntryRepository, StorageProvider } from "@/app/di/contracts";
import type { FoodEntry } from "@/shared/types/core";
import { isSameDateKey } from "@/shared/utils/date";

const STORAGE_KEY = "food_entries_v1";

export class LocalFoodEntryRepository implements FoodEntryRepository {
  constructor(private readonly storage: StorageProvider) {}

  async save(entry: FoodEntry): Promise<void> {
    const entries = await this.readAll();
    entries.push(entry);
    entries.sort((left, right) => new Date(right.consumedAt).getTime() - new Date(left.consumedAt).getTime());
    await this.storage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  async listByDate(date: string): Promise<FoodEntry[]> {
    const entries = await this.readAll();
    return entries.filter((entry) => isSameDateKey(entry.consumedAt, date));
  }

  private async readAll(): Promise<FoodEntry[]> {
    const raw = await this.storage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as FoodEntry[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
