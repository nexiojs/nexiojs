import type { ClientOptions } from "../types/client-options.type.ts";
import { getClientManager } from "./manager.ts";

export const createClient = (options: ClientOptions) => {
  return getClientManager().create(options);
};
