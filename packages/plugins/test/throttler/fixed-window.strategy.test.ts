import { describe, it, beforeEach, expect, jest } from "bun:test";
import {
  FixedWindowStrategy,
  InMemoryStorage,
  Throttler,
} from "../../src/throttler/index.ts";
import { Storage } from "../../src/throttler/interfaces/storage.interface.ts";

describe("FixedWindowStrategy", () => {
  let storage: Storage;
  let strategy: FixedWindowStrategy;

  beforeEach(() => {
    storage = {
      get: jest.fn().mockResolvedValue(0),
      set: jest.fn(),
    };

    strategy = new FixedWindowStrategy({ limit: 5, ttl: 1000 });
  });

  it("should allow request when count is below limit", async () => {
    expect(await strategy.isAllow("test", storage)).toBe(true);
    expect(storage.set).toHaveBeenCalledWith("test", 1, 1000);
  });

  it("should not allow request when count reaches limit", async () => {
    storage.get.mockResolvedValue(5);
    expect(await strategy.isAllow("test", storage)).toBe(false);
    expect(storage.set).not.toHaveBeenCalled();
  });

  it("should not allow request even if TTL hasn't passed when count is at limit", async () => {
    storage.get.mockResolvedValue(5);
    expect(await strategy.isAllow("test", storage)).toBe(false);
    expect(storage.set).not.toHaveBeenCalled();
  });
});
