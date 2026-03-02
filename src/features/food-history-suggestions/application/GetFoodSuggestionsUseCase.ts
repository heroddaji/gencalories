import type {
  FoodSearchProvider,
  FoodSuggestionService,
} from "@/app/di/contracts";

export interface FoodSuggestionOption {
  key: string;
  label: string;
  source: "history" | "catalog";
  normalizedName?: string;
  useCount?: number;
  quantity?: number;
  unit?: string;
}

export class GetFoodSuggestionsUseCase {
  constructor(
    private readonly suggestionService: FoodSuggestionService,
    private readonly foodSearchProvider: FoodSearchProvider,
  ) {}

  async execute(query: string, limit = 8): Promise<FoodSuggestionOption[]> {
    const [historySuggestions, catalogSuggestions] = await Promise.all([
      this.suggestionService.suggest(query, limit),
      this.foodSearchProvider.searchFoods(query, limit),
    ]);

    const history = historySuggestions.map((item) => ({
      key: `history:${item.normalizedName}`,
      label: item.displayName,
      source: "history" as const,
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
        source: "catalog" as const,
      }));

    return [...history, ...catalog].slice(0, limit);
  }
}
