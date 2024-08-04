import { Storage } from "../interfaces/storage.interface.ts";
import { SlidingWindowOptions } from "../interfaces/strategy-options.interface";
import { ThrottleStrategy } from "../interfaces/strategy.interface.ts";

export class SlidingWindowStrategy implements ThrottleStrategy {
  constructor(private readonly options: SlidingWindowOptions) {}

  async isAllow(key: string, storage: Storage): Promise<boolean> {
    const { limit, ttl } = this.options;
    const now = Date.now();
    const windowStart = now - ttl;

    const currentCount = (await storage.get(key)) ?? 0;

    if (currentCount + 1 >= limit) return false;

    await storage.set(key, currentCount + 1, windowStart + ttl - now);
    return true;
  }
}
