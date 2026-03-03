const STORAGE_KEY_PREFIX = "user_profile_v1";
const keyFor = (userId) => `${STORAGE_KEY_PREFIX}_${userId}`;
const normalizePositive = (value) => {
    if (!Number.isFinite(value) || !value || value <= 0) {
        return null;
    }
    return Math.round(value * 10) / 10;
};
const normalizeAge = (value) => {
    const normalized = normalizePositive(value);
    if (normalized === null) {
        return null;
    }
    return Math.round(normalized);
};
const normalizeProfile = (profile) => ({
    age: normalizeAge(profile.age),
    heightCm: normalizePositive(profile.heightCm),
    currentWeightKg: normalizePositive(profile.currentWeightKg),
    targetWeightKg: normalizePositive(profile.targetWeightKg),
});
const emptyProfile = () => ({
    age: null,
    heightCm: null,
    currentWeightKg: null,
    targetWeightKg: null,
});
export class LocalUserProfileRepository {
    constructor(storage) {
        this.storage = storage;
    }
    async getProfile(userId) {
        const raw = await this.storage.getItem(keyFor(userId));
        if (!raw) {
            return emptyProfile();
        }
        try {
            const parsed = JSON.parse(raw);
            return normalizeProfile(parsed);
        }
        catch {
            return emptyProfile();
        }
    }
    async saveProfile(userId, profile) {
        await this.storage.setItem(keyFor(userId), JSON.stringify(normalizeProfile(profile)));
    }
}
