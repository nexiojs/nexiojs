import { IApplication, IContext, IInterceptor, IPlugin } from "@nexiojs/common";
import { HttpExeception } from "@nexiojs/core";
import { Throttler } from "./throttler.ts";

type Options = {
  tracer: (ctx: IContext) => string;
  throttler: Throttler;
};

class ThrottlerInterceptor implements IInterceptor {
  constructor(private readonly options: Options) {}

  async pre(ctx: IContext<any>) {
    const key = this.options.tracer(ctx);
    const isAllowed = await this.options.throttler.isAllowed(key);

    if (!isAllowed) throw new HttpExeception("Too Many Requests", 429);
  }

  post(ctx: IContext<any>): void | Promise<void> {}
}

export class ThrottlerPlugun implements IPlugin {
  constructor(private readonly options: Options) {}

  apply(app: IApplication<IContext<any>>) {
    return app.addInterceptor(new ThrottlerInterceptor(this.options));
  }
}
