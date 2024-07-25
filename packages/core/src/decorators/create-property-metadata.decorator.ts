import type { DecoratorKind } from "@nexiojs/common";
import { CUSTOM_PROPERTY } from "@nexiojs/common";

type Options = {
  type: DecoratorKind;
} & any;

export const createPropertyDecorator = (
  options: Options,
  target?: Object
): PropertyDecorator => {
  return (originTarget, propertyKey: any) => {
    const newTarget = target ?? originTarget.constructor;

    const decorators = Reflect.getMetadata(CUSTOM_PROPERTY, newTarget) ?? [];

    Reflect.defineMetadata(
      CUSTOM_PROPERTY,
      [
        ...decorators,
        {
          key: propertyKey,
          target: originTarget.constructor,
          ...options,
        },
      ],
      newTarget
    );
  };
};
