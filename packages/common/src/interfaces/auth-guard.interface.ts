import { type IContext } from "./context.interface.ts";

export interface IAuthGuard {
  canActive(ctx: IContext): boolean | Promise<boolean>;
}
