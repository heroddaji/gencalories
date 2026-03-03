export class DeleteFoodEntryUseCase {
    constructor(entryRepository) {
        this.entryRepository = entryRepository;
    }
    async execute(userId, entryId) {
        await this.entryRepository.deleteById(userId, entryId);
    }
}
