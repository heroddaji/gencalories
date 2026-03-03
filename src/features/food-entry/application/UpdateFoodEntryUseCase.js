export class UpdateFoodEntryUseCase {
    constructor(nutritionProvider, entryRepository) {
        this.nutritionProvider = nutritionProvider;
        this.entryRepository = entryRepository;
    }
    async execute(input) {
        const nutritionSnapshot = await this.nutritionProvider.resolveNutrition({
            foodName: input.entry.foodName,
            quantity: input.quantity,
            unit: input.servingUnit,
        });
        const updatedEntry = {
            ...input.entry,
            quantity: input.quantity,
            servingUnit: input.servingUnit,
            nutritionSnapshot,
        };
        await this.entryRepository.update(updatedEntry);
        return updatedEntry;
    }
}
