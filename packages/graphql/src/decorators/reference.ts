import {
  DECORATOR_KIND_METADATA,
  DecoratorKind,
  GRAPHQL,
} from "@nexiojs/common";
import { createParamDecorator } from "@nexiojs/core";

export const Reference = () => {
  return createParamDecorator((ctx) => ctx[GRAPHQL].reference, {
    [DECORATOR_KIND_METADATA]: DecoratorKind.Reference,
  });
};
