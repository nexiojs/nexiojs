import {
  Adapter,
  compress,
  createContext,
  IAdapterOptions,
} from "@nexiojs/common";

export class DenoAdapter extends Adapter {
  async createServer(options: IAdapterOptions): Promise<void> {
    const { application, port = 3000 } = options;

    // @ts-ignore
    Deno.serve({ port }, async (request: Request) => {
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
    });
  }
}
