import { describe, it, setSystemTime, expect } from "bun:test";
import {
  FixedWindowStrategy,
  InMemoryStorage,
  Throttler,
} from "../../src/throttler/index.ts";

describe("FixedWindowStrategy", () => {
  it("", async () => {
    const limit = 10;

    const storage = new InMemoryStorage();
    const strategy = new FixedWindowStrategy({
      limit,
      ttl: 60000,
    });

    const throttler = new Throttler({
      storage,
      strategy,
    });

    const userId = "user:123";

    for (let i = 0; i < 12; i++) {
      const allowed = await throttler.isAllowed(userId);

      if (i + 1 > limit) {
        expect(allowed).toBeFalse();
      } else {
        expect(allowed).toBeTrue();
      }
    }

    // move forward
    setSystemTime(new Date("2999-01-01T00:00:00.000Z"));

    const allowed = await throttler.isAllowed(userId);

    expect(allowed).toBeTrue();
  });
});
