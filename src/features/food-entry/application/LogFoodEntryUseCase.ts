import type {
  FoodEntryRepository,
  FoodHistoryRepository,
  NutritionProvider,
} from "@/app/di/contracts";
import {
  createFoodEntry,
  type CreateFoodEntryInput,
} from "@/features/food-entry/domain/foodEntryFactory";
import type { FoodEntry } from "@/shared/types/core";

export interface LogFoodEntryInput {
  userId: string;
  foodName: string;
  quantity: number;
  servingUnit: string;
  consumedAt?: string;
}

export class LogFoodEntryUseCase {
  constructor(
    private readonly nutritionProvider: NutritionProvider,
    private readonly entryRepository: FoodEntryRepository,
    private readonly historyRepository: FoodHistoryRepository,
  ) {}

  async execute(input: LogFoodEntryInput): Promise<FoodEntry> {
    const consumedAt = input.consumedAt ?? new Date().toISOString();
    const nutritionSnapshot = await this.nutritionProvider.resolveNutrition({
      foodName: input.foodName,
      quantity: input.quantity,
      unit: input.servingUnit,
    });

    const entryInput: CreateFoodEntryInput = {
      userId: input.userId,
      foodName: input.foodName,
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
