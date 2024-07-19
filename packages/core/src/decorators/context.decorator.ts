import { DECORATOR_KIND_METADATA, DecoratorKind } from "@nexiojs/common";
import { createParamDecorator } from ".";

export const Context = (): ParameterDecorator => {
  return createParamDecorator((ctx) => ctx, {
    [DECORATOR_KIND_METADATA]: DecoratorKind.Context,
  });
};
