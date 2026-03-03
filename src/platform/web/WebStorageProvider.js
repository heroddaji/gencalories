class InMemoryStorage {
    constructor() {
        this.data = new Map();
    }
    getItem(key) {
        return this.data.get(key) ?? null;
    }
    setItem(key, value) {
        this.data.set(key, value);
    }
    removeItem(key) {
        this.data.delete(key);
    }
}
export class WebStorageProvider {
    constructor() {
        this.storage = typeof window === "undefined" ? new InMemoryStorage() : window.localStorage;
    }
    async getItem(key) {
        return this.storage.getItem(key);
    }
    async setItem(key, value) {
        this.storage.setItem(key, value);
    }
    async removeItem(key) {
        this.storage.removeItem(key);
    }
}
