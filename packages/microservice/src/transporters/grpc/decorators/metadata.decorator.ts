import { DecoratorKind } from "@nexiojs/common";
import { createParamDecorator } from "@nexiojs/core";

export const Metadata = () =>
  createParamDecorator((ctx) => ctx.metadata, {
    kind: DecoratorKind.Metadata,
  });
