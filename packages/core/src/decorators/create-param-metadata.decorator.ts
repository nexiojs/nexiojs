import type { DecoratorKind, IContext } from "@nexiojs/common";
import { CUSTOM_METADATA } from "@nexiojs/common";

type Options = {
  type: DecoratorKind;
} & any;

type Factory = (ctx: IContext) => any;

export const createParamDecorator = (
  factory: Factory,
  options?: Options
): ParameterDecorator => {
  return (target: any, propertyKey: any, index) => {
    const decorators =
      Reflect.getMetadata(CUSTOM_METADATA, target[propertyKey]) ?? [];

    Reflect.defineMetadata(
      CUSTOM_METADATA,
      [...decorators, { key: propertyKey, index, factory, ...options }],
      target[propertyKey]
    );
  };
};
