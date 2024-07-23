import {
  DECORATOR_KIND_METADATA,
  DecoratorKind,
  INTERFACE_TYPE_METADATA,
  type Constructor,
} from "@nexiojs/common";

type Options = {
  resolveType: (val: unknown) => Constructor | string;
};

export const InterfaceType = (options?: Options): ClassDecorator => {
  return (target) => {
    const interfaces =
      Reflect.getMetadata(INTERFACE_TYPE_METADATA, globalThis) ?? [];

    Reflect.defineMetadata(
      DECORATOR_KIND_METADATA,
      DecoratorKind.InterfaceType,
      target
    );

    Reflect.defineMetadata(
      INTERFACE_TYPE_METADATA,
      [...interfaces, { target, options }],
      globalThis
    );
  };
};
