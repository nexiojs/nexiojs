import { Storage } from "./interfaces/storage.interface.ts";
import { ThrottleStrategy } from "./interfaces/strategy.interface.ts";

type Options = {
  strategy: ThrottleStrategy;
  storage: Storage;
};

export class Throttler {
  constructor(private readonly options: Options) {}

  async isAllowed(key: string): Promise<boolean> {
    return this.options.strategy.isAllow(key, this.options.storage);
  }
}
