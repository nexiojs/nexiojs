import type { Constructor } from "@nexiojs/common";
import { getContainer } from "./service.ts";

export const resolveDI = <T = any>(Instance: Constructor<T>): T => {
  return getContainer().get(Instance) as T;
};
