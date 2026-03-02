import type { AppContainer } from "@/app/di/container";
import { LocalDailySummaryService } from "@/features/daily-summary/application/LocalDailySummaryService";
import { ListDailyEntriesUseCase } from "@/features/food-entry/application/ListDailyEntriesUseCase";
import { LogFoodEntryUseCase } from "@/features/food-entry/application/LogFoodEntryUseCase";
import { LocalFoodEntryRepository } from "@/features/food-entry/infrastructure/LocalFoodEntryRepository";
import { GetFoodSuggestionsUseCase } from "@/features/food-history-suggestions/application/GetFoodSuggestionsUseCase";
import { LocalFoodSuggestionService } from "@/features/food-history-suggestions/application/LocalFoodSuggestionService";
import {
  ClearFoodHistoryUseCase,
  DeleteFoodHistoryItemUseCase,
} from "@/features/food-history-suggestions/application/ManageFoodHistoryUseCases";
import { LocalFoodHistoryRepository } from "@/features/food-history-suggestions/infrastructure/LocalFoodHistoryRepository";
import {
  LocalFoodSearchProvider,
  LocalNutritionProvider,
} from "@/features/nutrition-lookup/infrastructure/LocalNutritionProvider";
import { SetDailyGoalUseCase } from "@/features/user-profile-goals/application/SetDailyGoalUseCase";
import { LocalUserGoalRepository } from "@/features/user-profile-goals/infrastructure/LocalUserGoalRepository";
import { WebLiveUpdateProvider } from "@/platform/web/WebLiveUpdateProvider";
import { WebStorageProvider } from "@/platform/web/WebStorageProvider";
import { WebSyncProvider } from "@/platform/web/WebSyncProvider";

export const createWebAppContainer = (userId = "local-user"): AppContainer => {
  const storageProvider = new WebStorageProvider();
  const syncProvider = new WebSyncProvider();
  const nutritionProvider = new LocalNutritionProvider();
  const foodSearchProvider = new LocalFoodSearchProvider();
  const foodHistoryRepository = new LocalFoodHistoryRepository(storageProvider);
  const foodSuggestionService = new LocalFoodSuggestionService(foodHistoryRepository);
  const foodEntryRepository = new LocalFoodEntryRepository(storageProvider);
  const userGoalRepository = new LocalUserGoalRepository(storageProvider);
  const liveUpdateProvider = new WebLiveUpdateProvider(storageProvider);

  const logFoodEntryUseCase = new LogFoodEntryUseCase(
    nutritionProvider,
    foodEntryRepository,
    foodHistoryRepository,
  );

  const listDailyEntriesUseCase = new ListDailyEntriesUseCase(foodEntryRepository);
  const getFoodSuggestionsUseCase = new GetFoodSuggestionsUseCase(
    foodSuggestionService,
    foodSearchProvider,
  );

  const clearFoodHistoryUseCase = new ClearFoodHistoryUseCase(foodHistoryRepository);
  const deleteFoodHistoryItemUseCase = new DeleteFoodHistoryItemUseCase(foodHistoryRepository);
  const dailySummaryService = new LocalDailySummaryService(
    foodEntryRepository,
    userGoalRepository,
    userId,
  );
  const setDailyGoalUseCase = new SetDailyGoalUseCase(userGoalRepository);

  return {
    userId,
    storageProvider,
    syncProvider,
    foodHistoryRepository,
    foodSearchProvider,
    logFoodEntryUseCase,
    listDailyEntriesUseCase,
    getFoodSuggestionsUseCase,
    clearFoodHistoryUseCase,
    deleteFoodHistoryItemUseCase,
    dailySummaryService,
    userGoalRepository,
    setDailyGoalUseCase,
    liveUpdateProvider,
  };
};
