import type { IApplication } from "./application.interface.ts";
import { IContext } from "./index.ts";

export interface IPlugin {
  apply: (app: IApplication<IContext>) => Promise<void> | void;
}
