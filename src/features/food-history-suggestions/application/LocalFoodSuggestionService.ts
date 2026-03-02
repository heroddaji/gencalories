import type {
  FoodHistoryRepository,
  FoodSuggestionService,
} from "@/app/di/contracts";
import { rankSuggestions } from "@/features/food-history-suggestions/domain/suggestionRanking";
import type { FoodHistoryItem } from "@/shared/types/core";

export class LocalFoodSuggestionService implements FoodSuggestionService {
  constructor(private readonly historyRepository: FoodHistoryRepository) {}

  async suggest(query: string, limit: number): Promise<FoodHistoryItem[]> {
    const candidates = await this.historyRepository.search(query, 200);
    return rankSuggestions(query, candidates, limit);
  }
}
