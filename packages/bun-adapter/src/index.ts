import "./polyfills/compress-stream";
import {
  Adapter,
  compress,
  createContext,
  type IAdapterOptions,
} from "@nexiojs/common";

export class BunAdapter extends Adapter {
  createServer(options: IAdapterOptions): void {
    const { application, port } = options;

    Bun.serve({
      port,
      fetch: async (request) => {
        const ctx = await createContext(options, request);

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

        return options.compress
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
      },
    });
  }
}
