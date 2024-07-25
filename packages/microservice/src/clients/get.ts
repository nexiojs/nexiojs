import type { ClientOptions } from "../types/client-options.type";
import { getClientManager } from "./manager";

export const getClient = (options: ClientOptions) => {
  return getClientManager().getClient(options);
};
