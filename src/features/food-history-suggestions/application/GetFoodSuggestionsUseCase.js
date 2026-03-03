export class GetFoodSuggestionsUseCase {
    constructor(suggestionService, foodSearchProvider) {
        this.suggestionService = suggestionService;
        this.foodSearchProvider = foodSearchProvider;
    }
    async execute(query, limit = 8) {
        const [historySuggestions, catalogSuggestions] = await Promise.all([
            this.suggestionService.suggest(query, limit),
            this.foodSearchProvider.searchFoods(query, limit),
        ]);
        const history = historySuggestions.map((item) => ({
            key: `history:${item.normalizedName}`,
            label: item.displayName,
            source: "history",
            normalizedName: item.normalizedName,
            useCount: item.useCount,
            quantity: item.recentServing.quantity,
            unit: item.recentServing.unit,
        }));
        const existing = new Set(history.map((item) => item.label.toLowerCase()));
        const catalog = catalogSuggestions
            .filter((item) => !existing.has(item.toLowerCase()))
            .map((item) => ({
            key: `catalog:${item.toLowerCase()}`,
            label: item,
            source: "catalog",
        }));
        return [...history, ...catalog].slice(0, limit);
    }
}
