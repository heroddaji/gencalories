import { Capacitor } from "@capacitor/core";
import type {
  LiveUpdateCheckResult,
  LiveUpdateProvider,
  LiveUpdateState,
  StorageProvider,
} from "@/app/di/contracts";
import { versionInfo } from "@/shared/versionInfo";

const STORAGE_KEY = "mobile_live_update_state_v1";

interface PersistedUpdateState {
  currentBundleVersion: string;
  manifestHash: string;
  manifestSignature: string;
  appliedAt: string;
  activeAppUrl?: string;
  rollbackReason?: string;
}

interface LatestBundleMetadata {
  version: string;
  hash?: string;
  signature?: string;
  downloadUrl?: string;
  artifactType?: "manifest" | "zip";
}

interface LiveUpdateBundleResult {
  bundleId?: string;
  checksum?: string;
  signature?: string;
  downloadUrl?: string;
  artifactType?: "manifest" | "zip";
}

interface LiveUpdatePlugin {
  getCurrentBundle(): Promise<{ bundleId?: string }>;
  fetchLatestBundle(): Promise<LiveUpdateBundleResult>;
  downloadBundle(options: {
    bundleId: string;
    url: string;
    artifactType?: "manifest" | "zip";
    checksum?: string;
    signature?: string;
  }): Promise<void>;
  setNextBundle(options: { bundleId: string }): Promise<void>;
  reload(): Promise<void>;
  reset(): Promise<void>;
}

const bundledState = (rollbackReason?: string): PersistedUpdateState => ({
  currentBundleVersion: versionInfo.bundleVersion,
  manifestHash: "native-bundled-hash",
  manifestSignature: "native-bundled-signature",
  appliedAt: new Date().toISOString(),
  rollbackReason,
});

export class MobileLiveUpdateProvider implements LiveUpdateProvider {
  private latestBundle: LatestBundleMetadata | null = null;
  private liveUpdatePluginPromise: Promise<LiveUpdatePlugin | null> | null =
    null;

  constructor(private readonly storage: StorageProvider) {}

  private isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  private async readPersistedState(): Promise<PersistedUpdateState> {
    const raw = await this.storage.getItem(STORAGE_KEY);
    if (!raw) {
      return bundledState();
    }

    try {
      const parsed = JSON.parse(raw) as Partial<PersistedUpdateState>;
      if (
        parsed.currentBundleVersion &&
        parsed.manifestHash &&
        parsed.manifestSignature &&
        parsed.appliedAt
      ) {
        return {
          currentBundleVersion: parsed.currentBundleVersion,
          manifestHash: parsed.manifestHash,
          manifestSignature: parsed.manifestSignature,
          appliedAt: parsed.appliedAt,
          activeAppUrl: parsed.activeAppUrl,
          rollbackReason: parsed.rollbackReason,
        };
      }
    } catch {
      return bundledState("Malformed previous state.");
    }

    return bundledState("Incomplete previous state.");
  }

  private async writeState(state: PersistedUpdateState): Promise<void> {
    await this.storage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  private async getLiveUpdatePlugin(): Promise<LiveUpdatePlugin | null> {
    if (!this.isNative()) {
      return null;
    }

    if (!this.liveUpdatePluginPromise) {
      const moduleName = "@capawesome/capacitor-live-update";
      this.liveUpdatePluginPromise = import(/* @vite-ignore */ moduleName)
        .then((module) => {
          const candidate = (module as { LiveUpdate?: LiveUpdatePlugin })
            .LiveUpdate;
          return candidate ?? null;
        })
        .catch(() => null);
    }

    return this.liveUpdatePluginPromise;
  }

  async getState(): Promise<LiveUpdateState> {
    const persisted = await this.readPersistedState();
    const liveUpdate = await this.getLiveUpdatePlugin();
    if (!liveUpdate) {
      return persisted;
    }

    try {
      const { bundleId } = await liveUpdate.getCurrentBundle();
      return {
        ...persisted,
        currentBundleVersion: bundleId ?? versionInfo.bundleVersion,
      };
    } catch {
      return persisted;
    }
  }

  async checkForUpdate(): Promise<LiveUpdateCheckResult> {
    const liveUpdate = await this.getLiveUpdatePlugin();
    if (!liveUpdate) {
      return { hasUpdate: false };
    }

    const current = await this.getState();

    try {
      const result = await liveUpdate.fetchLatestBundle();
      if (!result.bundleId) {
        this.latestBundle = null;
        return { hasUpdate: false };
      }

      this.latestBundle = {
        version: result.bundleId,
        hash: result.checksum,
        signature: result.signature,
        downloadUrl: result.downloadUrl,
        artifactType: result.artifactType,
      };

      return {
        hasUpdate: result.bundleId !== current.currentBundleVersion,
        nextBundleVersion: result.bundleId,
      };
    } catch {
      return { hasUpdate: false };
    }
  }

  private async readLatestBundle(
    version: string,
  ): Promise<LatestBundleMetadata> {
    if (this.latestBundle?.version === version) {
      return this.latestBundle;
    }

    const liveUpdate = await this.getLiveUpdatePlugin();
    if (!liveUpdate) {
      throw new Error("Live update plugin is not available.");
    }

    const result = await liveUpdate.fetchLatestBundle();
    if (!result.bundleId || result.bundleId !== version) {
      throw new Error("No matching live update bundle found.");
    }

    const latestBundle: LatestBundleMetadata = {
      version: result.bundleId,
      hash: result.checksum,
      signature: result.signature,
      downloadUrl: result.downloadUrl,
      artifactType: result.artifactType,
    };

    this.latestBundle = latestBundle;
    return latestBundle;
  }

  async applyUpdate(nextBundleVersion: string): Promise<void> {
    const liveUpdate = await this.getLiveUpdatePlugin();
    if (!liveUpdate) {
      return;
    }

    const nextBundle = await this.readLatestBundle(nextBundleVersion);
    if (!nextBundle.downloadUrl) {
      throw new Error("Live update bundle does not provide a download URL.");
    }

    await liveUpdate.downloadBundle({
      bundleId: nextBundle.version,
      url: nextBundle.downloadUrl,
      artifactType: nextBundle.artifactType,
      checksum: nextBundle.hash,
      signature: nextBundle.signature,
    });

    await liveUpdate.setNextBundle({ bundleId: nextBundle.version });

    await this.writeState({
      currentBundleVersion: nextBundle.version,
      manifestHash: nextBundle.hash ?? "native-downloaded-hash",
      manifestSignature: nextBundle.signature ?? "native-downloaded-signature",
      appliedAt: new Date().toISOString(),
      activeAppUrl: nextBundle.downloadUrl,
      rollbackReason: undefined,
    });

    await liveUpdate.reload();
  }

  async rollback(reason: string): Promise<void> {
    const fallbackState = bundledState(reason);

    await this.writeState(fallbackState);
    const liveUpdate = await this.getLiveUpdatePlugin();
    if (!liveUpdate) {
      return;
    }

    await liveUpdate.reset();
  }
}
