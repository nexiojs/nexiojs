import { describe, expect, it, jest } from "bun:test";
import { Adapter, IAdapterOptions } from "../../src/adapter/base.adapter.ts";

describe("Base Adapter", () => {
  const fn = jest.fn();

  class DummyAdapter extends Adapter {
    createServer(options: IAdapterOptions): void {
      return fn(options);
    }
  }

  it("createService should call", () => {
    const adapter = new DummyAdapter();
    adapter.createServer({} as unknown as any);

    expect(fn).toBeCalledTimes(1);
  });
});
