import type { Constructor } from "./constructor.interface";

export interface IApplication<T extends Record<string, any>> {
  init: () => void;
  emitAsync: <K = unknown>(event: string, ctx: T) => Promise<K>;
  emitInternal: <K = unknown>(event: string, ctx: T) => Promise<K>;
  on: (event: string, listener: any) => void;
  setRef: (path: string, ref: any) => void;
  lifecycle: (ctx: T, fn: Function, instance: Constructor) => Promise<any>;
}
