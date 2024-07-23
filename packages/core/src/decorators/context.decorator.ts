import { DECORATOR_KIND_METADATA, DecoratorKind } from "@nexiojs/common";
import { createParamDecorator } from "./create-param-metadata.decorator.ts";

export const Context = (): ParameterDecorator => {
  return createParamDecorator((ctx) => ctx, {
    [DECORATOR_KIND_METADATA]: DecoratorKind.Context,
  });
};
