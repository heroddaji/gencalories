import type { SyncProvider } from "@/app/di/contracts";

export class WebSyncProvider implements SyncProvider {
  async syncNow(): Promise<void> {
    return Promise.resolve();
  }
}
