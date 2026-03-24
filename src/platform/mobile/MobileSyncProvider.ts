import type { SyncProvider } from "@/app/di/contracts";

export class MobileSyncProvider implements SyncProvider {
  async syncNow(): Promise<void> {
    return Promise.resolve();
  }
}
