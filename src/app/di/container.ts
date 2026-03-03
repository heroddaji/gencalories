import type {
  DailySummaryService,
  FoodHistoryRepository,
  FoodSearchProvider,
  LiveUpdateProvider,
  StorageProvider,
  SyncProvider,
  UserGoalRepository,
  UserProfileRepository,
} from "@/app/di/contracts";
import type { DeleteFoodEntryUseCase } from "@/features/food-entry/application/DeleteFoodEntryUseCase";
import type { ListDailyEntriesUseCase } from "@/features/food-entry/application/ListDailyEntriesUseCase";
import type { LogFoodEntryUseCase } from "@/features/food-entry/application/LogFoodEntryUseCase";
import type { UpdateFoodEntryUseCase } from "@/features/food-entry/application/UpdateFoodEntryUseCase";
import type { GetFoodSuggestionsUseCase } from "@/features/food-history-suggestions/application/GetFoodSuggestionsUseCase";
import type {
  ClearFoodHistoryUseCase,
  DeleteFoodHistoryItemUseCase,
} from "@/features/food-history-suggestions/application/ManageFoodHistoryUseCases";
import type { SetDailyGoalUseCase } from "@/features/user-profile-goals/application/SetDailyGoalUseCase";
import type { SaveUserProfileUseCase } from "@/features/user-profile-goals/application/SaveUserProfileUseCase";

export interface AppContainer {
  readonly userId: string;
  readonly storageProvider: StorageProvider;
  readonly syncProvider: SyncProvider;
  readonly foodHistoryRepository: FoodHistoryRepository;
  readonly foodSearchProvider: FoodSearchProvider;
  readonly logFoodEntryUseCase: LogFoodEntryUseCase;
  readonly updateFoodEntryUseCase: UpdateFoodEntryUseCase;
  readonly deleteFoodEntryUseCase: DeleteFoodEntryUseCase;
  readonly listDailyEntriesUseCase: ListDailyEntriesUseCase;
  readonly getFoodSuggestionsUseCase: GetFoodSuggestionsUseCase;
  readonly clearFoodHistoryUseCase: ClearFoodHistoryUseCase;
  readonly deleteFoodHistoryItemUseCase: DeleteFoodHistoryItemUseCase;
  readonly dailySummaryService: DailySummaryService;
  readonly userGoalRepository: UserGoalRepository;
  readonly userProfileRepository: UserProfileRepository;
  readonly setDailyGoalUseCase: SetDailyGoalUseCase;
  readonly saveUserProfileUseCase: SaveUserProfileUseCase;
  readonly liveUpdateProvider: LiveUpdateProvider;
}
