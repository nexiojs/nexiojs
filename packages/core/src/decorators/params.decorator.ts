import { DecoratorKind } from "@nexiojs/common";
import { createParamDecorator } from "./create-param-metadata.decorator.ts";

export const Params = (key?: string): ParameterDecorator => {
  return createParamDecorator(
    (ctx) => {
      return !key ? ctx.req.params : ctx.req?.params?.[key];
    },
    {
      kind: DecoratorKind.Params,
    }
  );
};
