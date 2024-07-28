import { Storage } from "../interfaces/storage.interface.ts";
import { FixedWindowOptions } from "../interfaces/strategy-options.interface.ts";
import { ThrottleStrategy } from "../interfaces/strategy.interface.ts";

export class FixedWindowStrategy implements ThrottleStrategy {
  constructor(private readonly options: FixedWindowOptions) {}

  async isAllow(key: string, storage: Storage): Promise<boolean> {
    const { limit, ttl } = this.options;
    const currentCount = (await storage.get(key)) ?? 0;

    if (currentCount >= limit) return false;

    await storage.set(key, currentCount + 1, ttl);

    return true;
  }
}
