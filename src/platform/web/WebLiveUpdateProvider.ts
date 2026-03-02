import type {
  LiveUpdateCheckResult,
  LiveUpdateProvider,
  LiveUpdateState,
  StorageProvider,
} from "@/app/di/contracts";

const STORAGE_KEY = "live_update_state_v1";
const DEFAULT_MANIFEST_URL = "https://raw.githubusercontent.com/heroddaji/gencalories/main/live-update/manifest.json";
const LIVE_UPDATE_CACHE_PREFIX = "gencalories-live-update-";

interface RemoteManifest {
  version: string;
  hash: string;
  signature: string;
  appUrl: string;
  assets?: string[];
}

const bundleVersion = (): string => import.meta.env.VITE_APP_BUNDLE_VERSION ?? "bundled-1.0.0";

const isValidManifest = (value: Partial<RemoteManifest>): value is RemoteManifest => {
  return Boolean(value.version && value.hash && value.signature && value.appUrl);
};

const manifestUrl = (): string => {
  return import.meta.env.VITE_LIVE_UPDATE_MANIFEST_URL ?? DEFAULT_MANIFEST_URL;
};

const bundledState = (rollbackReason?: string): LiveUpdateState => ({
  currentBundleVersion: bundleVersion(),
  manifestHash: "bundled-hash",
  manifestSignature: "bundled-signature",
  appliedAt: new Date().toISOString(),
  rollbackReason,
});

export class WebLiveUpdateProvider implements LiveUpdateProvider {
  private latestManifest: RemoteManifest | null = null;

  constructor(private readonly storage: StorageProvider) {}

  async getState(): Promise<LiveUpdateState> {
    const raw = await this.storage.getItem(STORAGE_KEY);
    if (!raw) {
      return bundledState();
    }

    try {
      const parsed = JSON.parse(raw) as LiveUpdateState;
      if (parsed.currentBundleVersion && parsed.manifestHash && parsed.manifestSignature) {
        return parsed;
      }
    } catch {
      // Ignore malformed state and reset to bundled.
    }

    return bundledState("Malformed previous state.");
  }

  async checkForUpdate(): Promise<LiveUpdateCheckResult> {
    const current = await this.getState();

    try {
      const response = await fetch(manifestUrl(), { cache: "no-store" });
      if (!response.ok) {
        return { hasUpdate: false };
      }

      const manifest = (await response.json()) as Partial<RemoteManifest>;
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
    } catch {
      return { hasUpdate: false };
    }
  }

  private async readManifestForVersion(version: string): Promise<RemoteManifest> {
    if (this.latestManifest && this.latestManifest.version === version) {
      return this.latestManifest;
    }

    const response = await fetch(manifestUrl(), { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to fetch live update manifest.");
    }

    const manifest = (await response.json()) as Partial<RemoteManifest>;
    if (!isValidManifest(manifest) || manifest.version !== version || !manifest.signature.startsWith("sig_")) {
      throw new Error("Manifest validation failed.");
    }

    this.latestManifest = manifest;
    return manifest;
  }

  private async warmCache(manifest: RemoteManifest): Promise<string | undefined> {
    if (typeof caches === "undefined" || !manifest.assets || manifest.assets.length === 0) {
      return undefined;
    }

    const cacheName = `${LIVE_UPDATE_CACHE_PREFIX}${manifest.version}`;
    const cache = await caches.open(cacheName);
    await Promise.all(
      manifest.assets.map(async (assetPath) => {
        const normalizedPath = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
        const assetUrl = new URL(normalizedPath, manifest.appUrl).toString();
        const response = await fetch(assetUrl, { cache: "reload" });
        if (response.ok) {
          await cache.put(assetUrl, response.clone());
        }
      }),
    );

    return cacheName;
  }

  async applyUpdate(nextBundleVersion: string): Promise<void> {
    const manifest = await this.readManifestForVersion(nextBundleVersion);
    const cachedAt = await this.warmCache(manifest);
    const nextState: LiveUpdateState = {
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

  async rollback(reason: string): Promise<void> {
    const fallbackState: LiveUpdateState = bundledState(reason);

    await this.storage.setItem(STORAGE_KEY, JSON.stringify(fallbackState));
  }
}
