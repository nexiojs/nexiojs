import "reflect-metadata";
import { CUSTOM_METADATA, HEADER_METADATA } from "./symbols.ts";

export const resolveParams = async (listener: any, ctx: any, ref?: any) => {
  const data = new Array(listener.length);

  {
    const resHeaders = Reflect.getMetadata(HEADER_METADATA, listener) ?? [];
    Object.entries(resHeaders).forEach(([key, val]) => {
      ctx.res.headers.set(key, val as string);
    });
  }

  {
    const customDecorators =
      Reflect.getMetadata(CUSTOM_METADATA, listener) ?? [];

    for (const decorator of customDecorators) {
      data[decorator.index] = decorator.factory(ctx);
    }
  }

  let fn = listener;
  if (ref) {
    fn = listener.bind(ref);
  }

  const body = await fn(...data);

  return body;
};
