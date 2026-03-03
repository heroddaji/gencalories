export class SaveUserProfileUseCase {
    constructor(userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }
    async execute(userId, profile) {
        await this.userProfileRepository.saveProfile(userId, profile);
    }
}
