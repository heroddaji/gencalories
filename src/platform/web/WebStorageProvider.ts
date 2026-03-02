import type { StorageProvider } from "@/app/di/contracts";

class InMemoryStorage {
  private readonly data = new Map<string, string>();

  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }
}

export class WebStorageProvider implements StorageProvider {
  private readonly storage: Pick<Storage, "getItem" | "setItem" | "removeItem"> | InMemoryStorage;

  constructor() {
    this.storage = typeof window === "undefined" ? new InMemoryStorage() : window.localStorage;
  }

  async getItem(key: string): Promise<string | null> {
    return this.storage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    this.storage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.storage.removeItem(key);
  }
}
