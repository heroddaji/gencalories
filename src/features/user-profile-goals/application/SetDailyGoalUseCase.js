export class SetDailyGoalUseCase {
    constructor(userGoalRepository) {
        this.userGoalRepository = userGoalRepository;
    }
    async execute(userId, calories) {
        await this.userGoalRepository.setDailyCalorieGoal(userId, calories);
    }
}
