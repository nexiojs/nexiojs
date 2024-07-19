import {
  DECORATOR_KIND_METADATA,
  DecoratorKind,
  GRAPHQL,
} from "@nexiojs/common";
import { createParamDecorator } from "@nexiojs/core";

export const Info = () =>
  createParamDecorator(
    (ctx) => {
      return ctx[GRAPHQL].info;
    },
    {
      [DECORATOR_KIND_METADATA]: DecoratorKind.Info,
    }
  );
