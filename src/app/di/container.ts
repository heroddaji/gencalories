import type {
  DailySummaryService,
  FoodHistoryRepository,
  FoodSearchProvider,
  LiveUpdateProvider,
  StorageProvider,
  SyncProvider,
  UserGoalRepository,
} from "@/app/di/contracts";
import type { ListDailyEntriesUseCase } from "@/features/food-entry/application/ListDailyEntriesUseCase";
import type { LogFoodEntryUseCase } from "@/features/food-entry/application/LogFoodEntryUseCase";
import type { GetFoodSuggestionsUseCase } from "@/features/food-history-suggestions/application/GetFoodSuggestionsUseCase";
import type {
  ClearFoodHistoryUseCase,
  DeleteFoodHistoryItemUseCase,
} from "@/features/food-history-suggestions/application/ManageFoodHistoryUseCases";
import type { SetDailyGoalUseCase } from "@/features/user-profile-goals/application/SetDailyGoalUseCase";

export interface AppContainer {
  readonly userId: string;
  readonly storageProvider: StorageProvider;
  readonly syncProvider: SyncProvider;
  readonly foodHistoryRepository: FoodHistoryRepository;
  readonly foodSearchProvider: FoodSearchProvider;
  readonly logFoodEntryUseCase: LogFoodEntryUseCase;
  readonly listDailyEntriesUseCase: ListDailyEntriesUseCase;
  readonly getFoodSuggestionsUseCase: GetFoodSuggestionsUseCase;
  readonly clearFoodHistoryUseCase: ClearFoodHistoryUseCase;
  readonly deleteFoodHistoryItemUseCase: DeleteFoodHistoryItemUseCase;
  readonly dailySummaryService: DailySummaryService;
  readonly userGoalRepository: UserGoalRepository;
  readonly setDailyGoalUseCase: SetDailyGoalUseCase;
  readonly liveUpdateProvider: LiveUpdateProvider;
}
