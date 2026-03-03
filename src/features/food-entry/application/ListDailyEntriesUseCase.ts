import type { FoodEntryRepository } from "@/app/di/contracts";
import type { FoodEntry } from "@/shared/types/core";

export class ListDailyEntriesUseCase {
  constructor(private readonly entryRepository: FoodEntryRepository) {}

  async execute(userId: string, date: string): Promise<FoodEntry[]> {
    return this.entryRepository.listByDate(userId, date);
  }
}
