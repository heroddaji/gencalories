import type {
  FoodEntryRepository,
  NutritionProvider,
} from "@/app/di/contracts";
import type { FoodEntry } from "@/shared/types/core";

export interface UpdateFoodEntryInput {
  entry: FoodEntry;
  quantity: number;
  servingUnit: string;
}

export class UpdateFoodEntryUseCase {
  constructor(
    private readonly nutritionProvider: NutritionProvider,
    private readonly entryRepository: FoodEntryRepository,
  ) {}

  async execute(input: UpdateFoodEntryInput): Promise<FoodEntry> {
    const nutritionSnapshot = await this.nutritionProvider.resolveNutrition({
      foodName: input.entry.foodName,
      quantity: input.quantity,
      unit: input.servingUnit,
    });

    const updatedEntry: FoodEntry = {
      ...input.entry,
      quantity: input.quantity,
      servingUnit: input.servingUnit,
      nutritionSnapshot,
    };

    await this.entryRepository.update(updatedEntry);
    return updatedEntry;
  }
}
