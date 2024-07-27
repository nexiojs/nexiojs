import { Storage } from "./storage.interface.ts";

export interface ThrottleStrategy {
  isAllow(key: string, storage: Storage): Promise<boolean>;
}
