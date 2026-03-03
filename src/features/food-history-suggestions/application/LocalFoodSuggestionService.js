import { rankSuggestions } from "@/features/food-history-suggestions/domain/suggestionRanking";
export class LocalFoodSuggestionService {
    constructor(historyRepository) {
        this.historyRepository = historyRepository;
    }
    async suggest(query, limit) {
        const candidates = await this.historyRepository.search(query, 200);
        return rankSuggestions(query, candidates, limit);
    }
}
