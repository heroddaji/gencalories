export class ClearFoodHistoryUseCase {
    constructor(historyRepository) {
        this.historyRepository = historyRepository;
    }
    async execute() {
        await this.historyRepository.clearAll();
    }
}
export class DeleteFoodHistoryItemUseCase {
    constructor(historyRepository) {
        this.historyRepository = historyRepository;
    }
    async execute(normalizedName) {
        await this.historyRepository.deleteOne(normalizedName);
    }
}
