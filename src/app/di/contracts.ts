import type {
  DailyConsumptionSummary,
  FoodEntry,
  FoodHistoryItem,
  NutritionSnapshot,
  Serving,
} from "@/shared/types/core";

export interface NutritionProvider {
  resolveNutrition(input: {
    foodName: string;
    quantity: number;
    unit: string;
  }): Promise<NutritionSnapshot>;
}

export interface FoodSearchProvider {
  searchFoods(query: string, limit: number): Promise<string[]>;
}

export interface FoodHistoryRepository {
  upsert(item: {
    foodName: string;
    consumedAt: string;
    serving: Serving;
  }): Promise<void>;
  search(query: string, limit: number): Promise<FoodHistoryItem[]>;
  clearAll(): Promise<void>;
  deleteOne(normalizedName: string): Promise<void>;
}

export interface FoodSuggestionService {
  suggest(query: string, limit: number): Promise<FoodHistoryItem[]>;
}

export interface StorageProvider {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export interface SyncProvider {
  syncNow(): Promise<void>;
}

export interface LiveUpdateState {
  currentBundleVersion: string;
  manifestHash: string;
  manifestSignature: string;
  appliedAt: string;
  rollbackReason?: string;
}

export interface LiveUpdateCheckResult {
  hasUpdate: boolean;
  nextBundleVersion?: string;
}

export interface LiveUpdateProvider {
  getState(): Promise<LiveUpdateState>;
  checkForUpdate(): Promise<LiveUpdateCheckResult>;
  applyUpdate(nextBundleVersion: string): Promise<void>;
  rollback(reason: string): Promise<void>;
}

export interface FoodEntryRepository {
  save(entry: FoodEntry): Promise<void>;
  listByDate(date: string): Promise<FoodEntry[]>;
}

export interface DailySummaryService {
  forDate(date: string): Promise<DailyConsumptionSummary>;
}

export interface UserGoalRepository {
  getDailyCalorieGoal(userId: string): Promise<number>;
  setDailyCalorieGoal(userId: string, calories: number): Promise<void>;
}
