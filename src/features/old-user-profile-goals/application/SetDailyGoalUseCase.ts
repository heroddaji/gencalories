import type { UserGoalRepository } from "@/app/di/contracts";

export class SetDailyGoalUseCase {
  constructor(private readonly userGoalRepository: UserGoalRepository) {}

  async execute(userId: string, calories: number): Promise<void> {
    await this.userGoalRepository.setDailyCalorieGoal(userId, calories);
  }
}
