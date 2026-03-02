import type { FoodHistoryRepository, StorageProvider } from "@/app/di/contracts";
import type { FoodHistoryItem } from "@/shared/types/core";
import { normalizeFoodName, stringSimilarity } from "@/shared/utils/text";

const STORAGE_KEY = "food_history_v1";
const MAX_HISTORY_ITEMS = 2000;

export class LocalFoodHistoryRepository implements FoodHistoryRepository {
  constructor(private readonly storage: StorageProvider) {}

  async upsert(item: {
    foodName: string;
    consumedAt: string;
    serving: { quantity: number; unit: string };
  }): Promise<void> {
    const normalizedName = normalizeFoodName(item.foodName);
    if (!normalizedName) {
      return;
    }

    const current = await this.readAll();
    const match = current.find((value) => value.normalizedName === normalizedName);

    if (match) {
      match.displayName = item.foodName.trim();
      match.lastUsedAt = item.consumedAt;
      match.useCount += 1;
      match.recentServing = item.serving;
    } else {
      current.push({
        normalizedName,
        displayName: item.foodName.trim(),
        lastUsedAt: item.consumedAt,
        useCount: 1,
        recentServing: item.serving,
      });
    }

    const next = current
      .sort((left, right) => new Date(right.lastUsedAt).getTime() - new Date(left.lastUsedAt).getTime())
      .slice(0, MAX_HISTORY_ITEMS);

    await this.storage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  async search(query: string, limit: number): Promise<FoodHistoryItem[]> {
    const normalizedQuery = normalizeFoodName(query);
    const all = await this.readAll();

    if (!normalizedQuery) {
      return all
        .slice()
        .sort((left, right) => new Date(right.lastUsedAt).getTime() - new Date(left.lastUsedAt).getTime())
        .slice(0, limit);
    }

    return all
      .filter(
        (item) =>
          item.normalizedName.includes(normalizedQuery) ||
          stringSimilarity(item.normalizedName, normalizedQuery) > 0.2,
      )
      .slice(0, limit);
  }

  async clearAll(): Promise<void> {
    await this.storage.removeItem(STORAGE_KEY);
  }

  async deleteOne(normalizedName: string): Promise<void> {
    const all = await this.readAll();
    const next = all.filter((item) => item.normalizedName !== normalizedName);
    await this.storage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  private async readAll(): Promise<FoodHistoryItem[]> {
    const raw = await this.storage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as FoodHistoryItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
