import {
  DECORATOR_KIND_METADATA,
  DecoratorKind,
  GRAPHQL,
} from "@nexiojs/common";
import { createParamDecorator } from "@nexiojs/core";

export const Parent = () =>
  createParamDecorator(
    (ctx) => {
      return ctx[GRAPHQL].parent;
    },
    {
      [DECORATOR_KIND_METADATA]: DecoratorKind.Parent,
    }
  );
