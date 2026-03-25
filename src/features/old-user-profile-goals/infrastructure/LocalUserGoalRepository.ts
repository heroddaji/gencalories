import type { StorageProvider, UserGoalRepository } from "@/app/di/contracts";

const STORAGE_KEY_PREFIX = "daily_goal_v1";

const keyFor = (userId: string): string => `${STORAGE_KEY_PREFIX}_${userId}`;

export class LocalUserGoalRepository implements UserGoalRepository {
  constructor(private readonly storage: StorageProvider) {}

  async getDailyCalorieGoal(userId: string): Promise<number | null> {
    const raw = await this.storage.getItem(keyFor(userId));
    if (raw === null) {
      return null;
    }

    const parsed = raw ? Number(raw) : Number.NaN;

    if (!Number.isFinite(parsed) || parsed <= 0) {
      return null;
    }

    return parsed;
  }

  async setDailyCalorieGoal(userId: string, calories: number): Promise<void> {
    if (!Number.isFinite(calories) || calories <= 0) {
      throw new Error("Daily calorie goal must be greater than zero.");
    }

    await this.storage.setItem(keyFor(userId), String(Math.round(calories)));
  }
}
