import type {
  LiveUpdateCheckResult,
  LiveUpdateProvider,
  LiveUpdateState,
  StorageProvider,
} from "@/app/di/contracts";

const STORAGE_KEY = "live_update_state_v1";

interface RemoteManifest {
  version: string;
  hash: string;
  signature: string;
}

const bundleVersion = (): string => import.meta.env.VITE_APP_BUNDLE_VERSION ?? "bundled-1.0.0";

const isValidManifest = (value: Partial<RemoteManifest>): value is RemoteManifest => {
  return Boolean(value.version && value.hash && value.signature);
};

export class WebLiveUpdateProvider implements LiveUpdateProvider {
  constructor(private readonly storage: StorageProvider) {}

  async getState(): Promise<LiveUpdateState> {
    const raw = await this.storage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        currentBundleVersion: bundleVersion(),
        manifestHash: "bundled-hash",
        manifestSignature: "bundled-signature",
        appliedAt: new Date().toISOString(),
      };
    }

    try {
      const parsed = JSON.parse(raw) as LiveUpdateState;
      if (parsed.currentBundleVersion && parsed.manifestHash && parsed.manifestSignature) {
        return parsed;
      }
    } catch {
      // Ignore malformed state and reset to bundled.
    }

    return {
      currentBundleVersion: bundleVersion(),
      manifestHash: "bundled-hash",
      manifestSignature: "bundled-signature",
      appliedAt: new Date().toISOString(),
      rollbackReason: "Malformed previous state.",
    };
  }

  async checkForUpdate(): Promise<LiveUpdateCheckResult> {
    const current = await this.getState();

    try {
      const response = await fetch("/live-update/manifest.json", { cache: "no-store" });
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

      return {
        hasUpdate: manifest.version !== current.currentBundleVersion,
        nextBundleVersion: manifest.version,
      };
    } catch {
      return { hasUpdate: false };
    }
  }

  async applyUpdate(nextBundleVersion: string): Promise<void> {
    const current = await this.getState();
    const nextState: LiveUpdateState = {
      ...current,
      currentBundleVersion: nextBundleVersion,
      manifestHash: `hash_${nextBundleVersion}`,
      manifestSignature: `sig_${nextBundleVersion}`,
      appliedAt: new Date().toISOString(),
      rollbackReason: undefined,
    };

    await this.storage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  }

  async rollback(reason: string): Promise<void> {
    const fallbackState: LiveUpdateState = {
      currentBundleVersion: bundleVersion(),
      manifestHash: "bundled-hash",
      manifestSignature: "bundled-signature",
      appliedAt: new Date().toISOString(),
      rollbackReason: reason,
    };

    await this.storage.setItem(STORAGE_KEY, JSON.stringify(fallbackState));
  }
}
