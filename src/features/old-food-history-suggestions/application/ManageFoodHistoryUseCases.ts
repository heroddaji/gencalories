import type { FoodHistoryRepository } from "@/app/di/contracts";

export class ClearFoodHistoryUseCase {
  constructor(private readonly historyRepository: FoodHistoryRepository) {}

  async execute(): Promise<void> {
    await this.historyRepository.clearAll();
  }
}

export class DeleteFoodHistoryItemUseCase {
  constructor(private readonly historyRepository: FoodHistoryRepository) {}

  async execute(normalizedName: string): Promise<void> {
    await this.historyRepository.deleteOne(normalizedName);
  }
}
