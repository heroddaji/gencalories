import type { UserProfileRepository } from "@/app/di/contracts";
import type { UserProfile } from "@/shared/types/core";

export class SaveUserProfileUseCase {
  constructor(private readonly userProfileRepository: UserProfileRepository) {}

  async execute(userId: string, profile: UserProfile): Promise<void> {
    await this.userProfileRepository.saveProfile(userId, profile);
  }
}
