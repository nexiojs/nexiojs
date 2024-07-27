import { Storage } from "../interfaces/storage.interface.ts";

export class InMemoryStorage implements Storage {
  private stores: Map<string, { value: number; expiresAt: number }> = new Map();

  async get(key: string): Promise<number | null> {
    const store = this.stores.get(key);

    if (!store) return null;

    if (Date.now() > store.expiresAt) {
      this.stores.delete(key);
      return null;
    }

    return store.value;
  }

  async set(
    key: string,
    value: number,
    ttl?: number | undefined
  ): Promise<void> {
    const expiresAt = ttl ? Date.now() + ttl : Infinity;

    this.stores.set(key, { value, expiresAt });
  }
}
