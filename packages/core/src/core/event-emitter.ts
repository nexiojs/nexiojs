import "../polyfills/promise.ts";

import type {
  Constructor,
  IAuthGuard,
  IContext,
  IInterceptor,
} from "@nexiojs/common";
import {
  CALL_METADATA,
  IEventEmitter,
  INTERCEPTOR_METADATA,
  RABBIT_AUTH_GUARD,
  RABBIT_GLOBA_INTERCEPTOR,
  RABBIT_INTERCEPTOR,
  resolveParams,
} from "@nexiojs/common";
import isNil from "lodash.isnil";
import { match } from "path-to-regexp";
import {
  AUTH_GUARD_EVENT,
  AUTH_GUARD_FAILED_EVENT,
  GLOBAL_POST_INTERCEPTOR_EVENT,
  GLOBAL_PRE_INTERCEPTOR_EVENT,
  POST_INTERCEPTOR_EVENT,
  PRE_INTERCEPTOR_EVENT,
} from "../constants/event.constant.ts";
import { Context } from "../decorators/context.decorator.ts";
import { resolveDI } from "../dependency-injection/resolve.ts";
import { getContainer } from "../dependency-injection/service.ts";
import { HttpExeception } from "../errors/http.error.ts";
import { NotFoundError } from "../errors/not-found.error.ts";
import type { CallOptions } from "../types/call.type.ts";

export class NexioEventEmitter extends IEventEmitter<IContext> {
  private guards: Record<string, Constructor<IAuthGuard>[]> = {};
  private refs: Record<string, Constructor> = {};

  constructor() {
    super();
    this.events[AUTH_GUARD_FAILED_EVENT] = [this.handleAuthGuardFail as any];
    this.events[AUTH_GUARD_EVENT] = [this.handleAuthGuard as any];

    this.events[GLOBAL_PRE_INTERCEPTOR_EVENT] = [
      this.handlePreGlobalInterceptor as any,
    ];
    this.events[GLOBAL_POST_INTERCEPTOR_EVENT] = [
      this.handlePostGlobalInterceptor as any,
    ];

    this.events[PRE_INTERCEPTOR_EVENT] = [this.handlePreInterceptor as any];
    this.events[POST_INTERCEPTOR_EVENT] = [this.handlePostInterceptor as any];
  }

  setRef(path: string, ref: Constructor) {
    this.refs[path] = ref;
  }

  setGuards(key: string, val: Constructor<IAuthGuard>[]) {
    if (!this.guards[key]) {
      this.guards[key] = [];
    }
    this.guards[key]!.push(...val);
  }

  async emitInternal(event: string, ctx: IContext) {
    const [listener] = this.events[event] ?? [];

    if (!listener) return;

    return resolveParams(listener, ctx, this.refs[event] ?? this);
  }

  private async handleAuthGuard(@Context() ctx: IContext) {
    const guards = [
      ...(this.guards[ctx.event] ?? []),
      ...(ctx[RABBIT_AUTH_GUARD] ?? []),
    ];

    if (guards.length > 0) {
      const res = await Promise.all(
        guards.map((Guard: Constructor) =>
          getContainer().get(Guard).canActive(ctx)
        )
      );

      if (res.some((val) => val == false)) {
        return this.emitInternal(AUTH_GUARD_FAILED_EVENT, {
          ...ctx,
          guards,
        });
      }

      return true;
    }

    return true;
  }

  private async handleAuthGuardFail(@Context() ctx: IContext) {
    throw new HttpExeception("Unauthorized", 403);
  }

  private async handlePreGlobalInterceptor(@Context() ctx: IContext) {
    await Promise.chain(
      (ctx[RABBIT_GLOBA_INTERCEPTOR] ?? []).map((interceptor: IInterceptor) =>
        interceptor.pre(ctx)
      )
    );
  }

  private async handlePostGlobalInterceptor(@Context() ctx: IContext) {
    await Promise.chain(
      (ctx[RABBIT_GLOBA_INTERCEPTOR] ?? []).map((interceptor: IInterceptor) =>
        interceptor.post(ctx)
      )
    );
  }

  private async handlePreInterceptor(@Context() ctx: IContext) {
    const [listener] = this.events[ctx.event];
    const interceptors: Constructor<IInterceptor>[] =
      Reflect.getMetadata(INTERCEPTOR_METADATA, listener) ??
      ctx[RABBIT_INTERCEPTOR] ??
      [];

    ctx._interceptors = interceptors.map((Interceptor) => {
      return getContainer().get(Interceptor);
    });

    await Promise.chain(
      ctx._interceptors.map((interceptor: IInterceptor) => interceptor.pre(ctx))
    );
  }

  private async handlePostInterceptor(@Context() ctx: IContext) {
    await Promise.chain(
      (ctx._interceptors ?? []).map((interceptor: IInterceptor) =>
        interceptor.post(ctx)
      )
    );
  }

  async lifecycle(ctx: IContext, fn: Function, instance: Constructor) {
    {
      await this.emitInternal(PRE_INTERCEPTOR_EVENT, ctx);
    }

    {
      const res = await this.emitInternal(AUTH_GUARD_EVENT, ctx);

      if (typeof res !== "boolean") {
        return [res];
      }
    }

    const proxyFn = new Proxy(fn, {
      apply: async (target, thisArg, argArray) => {
        argArray.push(ctx);
        const result = await Reflect.apply(target, thisArg, argArray);

        return result;
      },
    });
    const keys = Reflect.getMetadataKeys(fn);
    keys.forEach((key) => {
      const metadata = Reflect.getMetadata(key, fn);
      Reflect.defineMetadata(key, metadata, proxyFn);
    });

    const res = await resolveParams(proxyFn, ctx, instance).catch(
      (e: Error) => e
    );
    ctx.res.body = res;

    {
      const rpc = Reflect.getMetadata(CALL_METADATA, fn) ?? [];
      await Promise.chain(
        rpc.map(({ when, instance, method }: CallOptions) => {
          if (when(res)) {
            const Instance = resolveDI(instance);

            return resolveParams(Instance[method], ctx, Instance);
          }
        })
      );
    }

    await this.emitInternal(POST_INTERCEPTOR_EVENT, ctx);

    return res;
  }

  async emitAsync(event: string, ctx: IContext): Promise<any> {
    const [fn] = this.events[event] ?? [];

    await this.emitInternal(GLOBAL_PRE_INTERCEPTOR_EVENT, ctx);

    // Check exact path
    let res: unknown;
    if (fn) {
      res = await this.lifecycle(ctx, fn, this.refs[event] ?? this);
    }

    if (isNil(res)) {
      for (const key of Object.keys(this.events)) {
        const fn = match(key, { decode: decodeURIComponent });
        const pathMatch = fn(event as string);
        if (pathMatch) {
          ctx.event = key;
          ctx.req.params = pathMatch.params;

          const [fn] = this.events[key] ?? [];

          if (fn) {
            res = await this.lifecycle(ctx, fn, this.refs[event] ?? this);
            break;
          }
        }
      }
    }

    await this.emitInternal(GLOBAL_POST_INTERCEPTOR_EVENT, ctx);

    if (isNil(res)) throw new NotFoundError();

    if (res instanceof Error) {
      throw res;
    }

    return res;
  }
}
