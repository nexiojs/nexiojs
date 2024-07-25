import type { Constructor } from "./constructor.interface.ts";
import type { IContext } from "./context.interface.ts";

export interface IApplication<T = IContext> {
  init: () => void;
  emitAsync: <K = unknown>(event: string, ctx: T) => Promise<K>;
  emitInternal: <K = unknown>(event: string, ctx: T) => Promise<K>;
  on: (event: string, listener: any) => void;
  setRef: (path: string, ref: any) => void;
  lifecycle: (ctx: T, fn: Function, instance: Constructor) => Promise<any>;
}
