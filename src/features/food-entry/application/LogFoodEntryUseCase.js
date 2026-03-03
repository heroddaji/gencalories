import { createFoodEntry, } from "@/features/food-entry/domain/foodEntryFactory";
export class LogFoodEntryUseCase {
    constructor(nutritionProvider, entryRepository, historyRepository) {
        this.nutritionProvider = nutritionProvider;
        this.entryRepository = entryRepository;
        this.historyRepository = historyRepository;
    }
    async execute(input) {
        const consumedAt = input.consumedAt ?? new Date().toISOString();
        const nutritionSnapshot = await this.nutritionProvider.resolveNutrition({
            foodName: input.foodName,
            quantity: input.quantity,
            unit: input.servingUnit,
        });
        const entryInput = {
            userId: input.userId,
            foodName: input.foodName,
            mealType: input.mealType,
            quantity: input.quantity,
            servingUnit: input.servingUnit,
            consumedAt,
            nutritionSnapshot,
        };
        const entry = createFoodEntry(entryInput);
        await this.entryRepository.save(entry);
        await this.historyRepository.upsert({
            foodName: input.foodName,
            consumedAt,
            serving: {
                quantity: input.quantity,
                unit: input.servingUnit,
            },
        });
        return entry;
    }
}
