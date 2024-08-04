import { Storage } from "../interfaces/storage.interface.ts";
import { TokenBucketOptions } from "../interfaces/strategy-options.interface.ts";
import { ThrottleStrategy } from "../interfaces/strategy.interface.ts";

export class TokenBucketStrategy implements ThrottleStrategy {
  constructor(private readonly options: TokenBucketOptions) {}

  async isAllow(key: string, storage: Storage): Promise<boolean> {
    const { limit, refillRate } = this.options;

    const now = Date.now();
    const refill = limit / refillRate;
    const lastRefill = (await storage.get(`${key}:lastRefill`)) ?? now;
    const tokens = (await storage.get(key)) ?? limit;

    const elapsed = now - lastRefill;
    const newTokens = Math.min(limit, tokens + elapsed * refill);

    if (newTokens < 1) return false;

    await storage.set(key, newTokens - 1);
    await storage.set(`${key}:lastRefill`, now);
    return true;
  }
}
