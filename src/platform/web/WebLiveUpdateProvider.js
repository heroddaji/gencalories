import { versionInfo } from "@/shared/versionInfo";
const STORAGE_KEY = "live_update_state_v1";
const DEFAULT_MANIFEST_URL = "https://raw.githubusercontent.com/heroddaji/gencalories/main/live-update/manifest.json";
const LIVE_UPDATE_CACHE_PREFIX = "gencalories-live-update-";
const isValidManifest = (value) => {
    return Boolean(value.version && value.hash && value.signature && value.appUrl);
};
const manifestUrl = () => {
    return import.meta.env.VITE_LIVE_UPDATE_MANIFEST_URL ?? DEFAULT_MANIFEST_URL;
};
const bundledState = (rollbackReason) => ({
    currentBundleVersion: versionInfo.bundleVersion,
    manifestHash: "bundled-hash",
    manifestSignature: "bundled-signature",
    appliedAt: new Date().toISOString(),
    rollbackReason,
});
export class WebLiveUpdateProvider {
    constructor(storage) {
        this.storage = storage;
        this.latestManifest = null;
    }
    async getState() {
        const raw = await this.storage.getItem(STORAGE_KEY);
        if (!raw) {
            return bundledState();
        }
        try {
            const parsed = JSON.parse(raw);
            if (parsed.currentBundleVersion && parsed.manifestHash && parsed.manifestSignature) {
                return parsed;
            }
        }
        catch {
            // Ignore malformed state and reset to bundled.
        }
        return bundledState("Malformed previous state.");
    }
    async checkForUpdate() {
        const current = await this.getState();
        try {
            const response = await fetch(manifestUrl(), { cache: "no-store" });
            if (!response.ok) {
                return { hasUpdate: false };
            }
            const manifest = (await response.json());
            if (!isValidManifest(manifest)) {
                return { hasUpdate: false };
            }
            if (!manifest.signature.startsWith("sig_")) {
                return { hasUpdate: false };
            }
            this.latestManifest = manifest;
            return {
                hasUpdate: manifest.version !== current.currentBundleVersion,
                nextBundleVersion: manifest.version,
            };
        }
        catch {
            return { hasUpdate: false };
        }
    }
    async readManifestForVersion(version) {
        if (this.latestManifest && this.latestManifest.version === version) {
            return this.latestManifest;
        }
        const response = await fetch(manifestUrl(), { cache: "no-store" });
        if (!response.ok) {
            throw new Error("Failed to fetch live update manifest.");
        }
        const manifest = (await response.json());
        if (!isValidManifest(manifest) || manifest.version !== version || !manifest.signature.startsWith("sig_")) {
            throw new Error("Manifest validation failed.");
        }
        this.latestManifest = manifest;
        return manifest;
    }
    async warmCache(manifest) {
        if (typeof caches === "undefined" || !manifest.assets || manifest.assets.length === 0) {
            return undefined;
        }
        const cacheName = `${LIVE_UPDATE_CACHE_PREFIX}${manifest.version}`;
        const cache = await caches.open(cacheName);
        await Promise.all(manifest.assets.map(async (assetPath) => {
            const normalizedPath = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
            const assetUrl = new URL(normalizedPath, manifest.appUrl).toString();
            const response = await fetch(assetUrl, { cache: "reload" });
            if (response.ok) {
                await cache.put(assetUrl, response.clone());
            }
        }));
        return cacheName;
    }
    async applyUpdate(nextBundleVersion) {
        const manifest = await this.readManifestForVersion(nextBundleVersion);
        const cachedAt = await this.warmCache(manifest);
        const nextState = {
            currentBundleVersion: nextBundleVersion,
            manifestHash: manifest.hash,
            manifestSignature: manifest.signature,
            appliedAt: new Date().toISOString(),
            activeAppUrl: manifest.appUrl,
            cachedAt,
            rollbackReason: undefined,
        };
        await this.storage.setItem(STORAGE_KEY, JSON.stringify(nextState));
        if (typeof window !== "undefined") {
            const target = new URL(manifest.appUrl, window.location.href);
            target.searchParams.set("liveUpdateVersion", manifest.version);
            window.location.replace(target.toString());
        }
    }
    async rollback(reason) {
        const fallbackState = bundledState(reason);
        await this.storage.setItem(STORAGE_KEY, JSON.stringify(fallbackState));
    }
}
