import type { IContext, IInterceptor } from "@nexiojs/common";
import { Context } from "@nexiojs/core";

export class LoggingInterceptor implements IInterceptor {
  start = new Date();

  pre(ctx: IContext): void | Promise<void> {
    this.start = new Date();
  }

  // make sure add the decorator when use Call decorator
  post(@Context() ctx: IContext): void | Promise<void> {
    const taken = Date.now() - this.start.getTime();
    console.log("End", taken / 1000, "s");

    ctx.res.headers.set("X-Response-Time", `${taken}`);
  }
}
