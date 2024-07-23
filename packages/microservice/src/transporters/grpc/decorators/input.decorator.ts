import { DecoratorKind } from "@nexiojs/common";
import { createParamDecorator } from "@nexiojs/core";

type ReturnTypeFn = () => any;
type Options = {
  isStream?: boolean;
};

export const Input = (type: ReturnTypeFn, options?: Options) =>
  createParamDecorator(
    (ctx) => {
      return ctx.req.body;
    },
    {
      kind: DecoratorKind.GrpcInput,
      returnType: type().name,
      type: type(),
      ...options,
    }
  );
