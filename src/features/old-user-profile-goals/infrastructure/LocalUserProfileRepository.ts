import type { StorageProvider, UserProfileRepository } from "@/app/di/contracts";
import type { UserProfile } from "@/shared/types/core";

const STORAGE_KEY_PREFIX = "user_profile_v1";

const keyFor = (userId: string): string => `${STORAGE_KEY_PREFIX}_${userId}`;

const normalizePositive = (value: number | null | undefined): number | null => {
  if (!Number.isFinite(value) || !value || value <= 0) {
    return null;
  }

  return Math.round(value * 10) / 10;
};

const normalizeAge = (value: number | null | undefined): number | null => {
  const normalized = normalizePositive(value);
  if (normalized === null) {
    return null;
  }

  return Math.round(normalized);
};

const normalizeProfile = (profile: UserProfile): UserProfile => ({
  age: normalizeAge(profile.age),
  heightCm: normalizePositive(profile.heightCm),
  currentWeightKg: normalizePositive(profile.currentWeightKg),
  targetWeightKg: normalizePositive(profile.targetWeightKg),
});

const emptyProfile = (): UserProfile => ({
  age: null,
  heightCm: null,
  currentWeightKg: null,
  targetWeightKg: null,
});

export class LocalUserProfileRepository implements UserProfileRepository {
  constructor(private readonly storage: StorageProvider) {}

  async getProfile(userId: string): Promise<UserProfile> {
    const raw = await this.storage.getItem(keyFor(userId));
    if (!raw) {
      return emptyProfile();
    }

    try {
      const parsed = JSON.parse(raw) as UserProfile;
      return normalizeProfile(parsed);
    } catch {
      return emptyProfile();
    }
  }

  async saveProfile(userId: string, profile: UserProfile): Promise<void> {
    await this.storage.setItem(keyFor(userId), JSON.stringify(normalizeProfile(profile)));
  }
}
