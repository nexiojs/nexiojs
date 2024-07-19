import type { IContext } from "./context.interface";

export interface IInterceptor<T = IContext> {
  pre(ctx: T): void | Promise<void>;
  post(ctx: T): void | Promise<void>;
}
