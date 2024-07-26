import {
  AUTH_GUARD_METADATA,
  CONTROLLER_METADATA,
  IInterceptor,
  IsConstructor,
  IsFunction,
  METHOD_METADATA,
  PATH_METADATA,
  type ApplicationInitOptions,
  type Constructor,
  type IApplication,
  type IContext,
  type IPlugin,
} from "@nexiojs/common";
import {
  GLOBAL_POST_INTERCEPTOR_EVENT,
  GLOBAL_PRE_INTERCEPTOR_EVENT,
} from "../constants/event.constant.ts";
import { resolveDI } from "../dependency-injection/resolve.ts";
import { pathToEvent } from "../utils/path-to-event.ts";
import { NexioEventEmitter } from "./event-emitter.ts";

export class Application implements IApplication<IContext> {
  private eventEmitter = new NexioEventEmitter();

  constructor() {}

  async init(options: ApplicationInitOptions) {
    options.interceptors.forEach((interceptor) => {
      this.addInterceptor(interceptor);
    });

    const controllers: Constructor[] =
      Reflect.getMetadata(CONTROLLER_METADATA, globalThis) ?? [];

    controllers.forEach((Controller) => {
      const instance = resolveDI(Controller);
      const prototype = Object.getPrototypeOf(instance);
      const methodsNames = Object.getOwnPropertyNames(prototype).filter(
        (item) => !IsConstructor(item) && IsFunction(prototype[item])
      );
      const rootPath = Reflect.getMetadata(PATH_METADATA, instance.constructor);

      methodsNames.forEach((methodName) => {
        let fn = instance[methodName];
        const route = Reflect.getMetadata(PATH_METADATA, fn);
        const method = Reflect.getMetadata(METHOD_METADATA, fn);
        const guards: any[] =
          Reflect.getMetadata(AUTH_GUARD_METADATA, fn) ?? [];
        const path = pathToEvent(`${rootPath}${route}`, method);
        this.eventEmitter.setGuards(path, guards);

        // To bind this ref
        this.eventEmitter.setRef(path, instance);
        this.eventEmitter.on(path, fn);
      });
    });

    return this as IApplication<IContext>;
  }

  async emitAsync(event: string, ctx: IContext) {
    const res = await this.eventEmitter.emitAsync(event, ctx);

    return res;
  }

  async on(event: string, listener: any) {
    return this.eventEmitter.on(event, listener);
  }

  once(event: string, listener: any) {
    this.eventEmitter.once(event, listener);
  }

  setRef(path: string, ref: Constructor<any>) {
    this.eventEmitter.setRef(path, ref);
  }

  async emitInternal(event: string, ctx: IContext) {
    return this.eventEmitter.emitInternal(event, ctx);
  }

  async lifecycle(ctx: IContext, fn: Function, instance: Constructor) {
    await this.emitInternal(GLOBAL_PRE_INTERCEPTOR_EVENT, ctx);
    const res = await this.eventEmitter.lifecycle(ctx, fn, instance);
    await this.emitInternal(GLOBAL_POST_INTERCEPTOR_EVENT, ctx);

    return res;
  }

  async use(plugin: IPlugin) {
    await plugin.apply(this as IApplication<IContext>);
  }

  addInterceptor(interceptor: IInterceptor<IContext>) {
    this.eventEmitter.addInterceptor(interceptor);
  }
}
