import {
  AUTH_GUARD_METADATA,
  CONTROLLER_METADATA,
  IsConstructor,
  IsFunction,
  METHOD_METADATA,
  PATH_METADATA,
  type ApplicationOptions,
  type Constructor,
  type IApplication,
  type IContext,
} from "@nexiojs/common";
import { resolveDI } from "../dependency-injection/resolve.ts";
import { pathToEvent } from "../utils/path-to-event.ts";
import { RabbitEventEmitter } from "./event-emitter.ts";
import {
  GLOBAL_PRE_INTERCEPTOR_EVENT,
  GLOBAL_POST_INTERCEPTOR_EVENT,
} from "../constants/event.constant.ts";

export class Application implements IApplication<any> {
  private eventEmitter = new RabbitEventEmitter();

  constructor() {}

  init() {
    const controllers: Constructor[] =
      Reflect.getMetadata(CONTROLLER_METADATA, global) ?? [];

    controllers.forEach((controller) => {
      const instance = new controller(...resolveDI(controller));
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

    return this;
  }

  async emitAsync(event: string, ctx: IContext) {
    const res = await this.eventEmitter.emitAsync(event, ctx);

    return res;
  }

  async on(event: string, listener: any) {
    return this.eventEmitter.on(event, listener);
  }

  setRef(path: string, ref: Constructor<any>) {
    this.eventEmitter.setRef(path, ref);
  }

  async emitInternal(event: string, ctx: IContext) {
    return this.eventEmitter.emitInternal(event, ctx);
  }

  async lifecycle(ctx: IContext, fn: Function) {
    await this.emitInternal(GLOBAL_PRE_INTERCEPTOR_EVENT, ctx);
    const res = await this.eventEmitter.lifecycle(ctx, fn);
    await this.emitInternal(GLOBAL_POST_INTERCEPTOR_EVENT, ctx);

    return res;
  }
}
