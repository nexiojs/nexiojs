import { Kind } from "../enums/index.ts";
import type { ApplicationOptions } from "../interfaces/application-options.interface.ts";
import type { IApplication } from "../interfaces/application.interface.ts";
import type { IContext } from "../interfaces/context.interface.ts";
import type { IInterceptor } from "../interfaces/interceptor.interface.ts";

export type IAdapterOptions = {
  application: IApplication<IContext>;
  interceptors: IInterceptor[];
  makeContext?: (ctx: IContext) => Promise<any>;
} & Omit<ApplicationOptions, "adapter" | "interceptors">;

export abstract class Adapter<T = IAdapterOptions> {
  static kind: Kind = Kind.Http;

  constructor() {}

  abstract createServer(options: T): Promise<void>;
}
