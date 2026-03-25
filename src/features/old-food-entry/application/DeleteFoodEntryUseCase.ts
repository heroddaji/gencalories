import type { FoodEntryRepository } from "@/app/di/contracts";

export class DeleteFoodEntryUseCase {
  constructor(private readonly entryRepository: FoodEntryRepository) {}

  async execute(userId: string, entryId: string): Promise<void> {
    await this.entryRepository.deleteById(userId, entryId);
  }
}
