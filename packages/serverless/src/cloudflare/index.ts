import { ExecutionContext } from "@cloudflare/workers-types";
import {
  Adapter,
  IAdapterOptions,
  compress,
  createContext,
} from "@nexiojs/common";

declare module "@nexiojs/common" {
  interface IContext<Body = any, Env = any> {
    cloudflare: {
      env: Env;
      context: ExecutionContext;
    };
  }
}

export class CloudflareAdapter extends Adapter {
  options!: IAdapterOptions;

  async createServer(options: IAdapterOptions) {
    this.options = options;
  }

  async handler<T>(request: Request, env: T, context: ExecutionContext) {
    const { application } = this.options;
    const ctx = await createContext(this.options, request);

    ctx.cloudflare = {
      env,
      context,
    };

    console.log(ctx.event);

    await application.emitAsync(ctx.event, ctx).catch((err) => {
      ctx.res.body = err.message;
      ctx.res.status = err.statusCode;

      return err.message;
    });

    const headers = new Headers({
      ...ctx.res.headers,
      ...(typeof ctx.res.body === "object" && {
        "Content-Type": "application/json",
      }),
    });

    return this.options.compress
      ? compress({
          ctx,
        })
      : new Response(
          typeof ctx.res.body === "object"
            ? JSON.stringify(ctx.res.body)
            : ctx.res.body,
          {
            headers,
          }
        );
  }
}
