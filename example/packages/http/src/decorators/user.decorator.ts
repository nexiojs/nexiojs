import { createParamDecorator } from "@nexiojs/core";

export const User = () =>
  createParamDecorator((ctx) => {
    return ctx.user;
  });
