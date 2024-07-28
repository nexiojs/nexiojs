import { describe, it, expect } from "bun:test";
import { InMemoryStorage, SlidingWindowStrategy } from "../../src/throttler";

const storage = new InMemoryStorage();

describe("SlidingWindowStrategy", () => {
  it("should allow requests within the limit", async () => {
    const strategy = new SlidingWindowStrategy({ limit: 5, ttl: 1000 });
    expect(await strategy.isAllow("key1", storage)).toBe(true);
    expect(await strategy.isAllow("key1", storage)).toBe(true);
    expect(await strategy.isAllow("key1", storage)).toBe(true);
    expect(await strategy.isAllow("key1", storage)).toBe(true);
    expect(await strategy.isAllow("key1", storage)).toBe(true);
  });

  it("should block requests exceeding the limit", async () => {
    const strategy = new SlidingWindowStrategy({ limit: 5, ttl: 1000 });
    expect(await strategy.isAllow("key1", storage)).toBe(true);
    expect(await strategy.isAllow("key1", storage)).toBe(true);
    expect(await strategy.isAllow("key1", storage)).toBe(true);
    expect(await strategy.isAllow("key1", storage)).toBe(true);
    expect(await strategy.isAllow("key1", storage)).toBe(true);
    expect(await strategy.isAllow("key1", storage)).toBe(false);
  });

  it("should allow requests after the ttl expires", async () => {
    const strategy = new SlidingWindowStrategy({ limit: 5, ttl: 100 });
    expect(await strategy.isAllow("key1", storage)).toBe(true);
    expect(await strategy.isAllow("key1", storage)).toBe(true);
    await new Promise((resolve) => setTimeout(resolve, 110));
    expect(await strategy.isAllow("key1", storage)).toBe(true);
  });

  it("should handle concurrent requests", async () => {
    const strategy = new SlidingWindowStrategy({ limit: 5, ttl: 1000 });
    const promises = [];
    for (let i = 0; i < 6; i++) {
      promises.push(strategy.isAllow("key1", storage));
    }
    const results = await Promise.all(promises);
    expect(results.slice(0, 5).every((result) => result)).toBe(true);
    expect(results[5]).toBe(false);
  });

  it("should work with different keys", async () => {
    const strategy = new SlidingWindowStrategy({ limit: 5, ttl: 1000 });
    expect(await strategy.isAllow("key1", storage)).toBe(true);
    expect(await strategy.isAllow("key2", storage)).toBe(true);
    expect(await strategy.isAllow("key3", storage)).toBe(true);
    expect(await strategy.isAllow("key1", storage)).toBe(true);
    expect(await strategy.isAllow("key2", storage)).toBe(true);
    expect(await strategy.isAllow("key3", storage)).toBe(true);
    expect(await strategy.isAllow("key1", storage)).toBe(true);
  });

  it("should handle multiple requests within the ttl", async () => {
    const strategy = new SlidingWindowStrategy({ limit: 5, ttl: 1000 });
    expect(await strategy.isAllow("key1", storage)).toBe(true);
    expect(await strategy.isAllow("key1", storage)).toBe(true);
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(await strategy.isAllow("key1", storage)).toBe(true);
    expect(await strategy.isAllow("key1", storage)).toBe(true);
    expect(await strategy.isAllow("key1", storage)).toBe(true);
    expect(await strategy.isAllow("key1", storage)).toBe(false);
  });
});
