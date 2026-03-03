export class ListDailyEntriesUseCase {
    constructor(entryRepository) {
        this.entryRepository = entryRepository;
    }
    async execute(userId, date) {
        return this.entryRepository.listByDate(userId, date);
    }
}
