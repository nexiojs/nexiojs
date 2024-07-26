import type { Constructor } from "./constructor.interface.ts";
import type { IContext } from "./context.interface.ts";
import { IInterceptor } from "./interceptor.interface.ts";
import type { IPlugin } from "./plugin.interface.ts";

export type ApplicationInitOptions = {
  interceptors: IInterceptor<IContext>[];
};

export interface IApplication<T = IContext> {
  init: (
    options: ApplicationInitOptions
  ) => Promise<IApplication<T>> | IApplication<T>;
  emitAsync: (event: string, ctx: T) => Promise<any>;
  emitInternal: (event: string, ctx: T) => Promise<any>;
  on: (event: string, listener: any) => void;
  once: (event: string, listener: any) => void;
  setRef: (path: string, ref: any) => void;
  lifecycle: (ctx: T, fn: Function, instance: Constructor) => Promise<any>;
  use: (plugin: IPlugin) => Promise<void> | void;
  addInterceptor: (interceptor: IInterceptor) => void;
}
