import { OBJECT_TYPE_METADATA } from "@nexiojs/common";

type Options = {
  interfaces?: () => any[];
};

export const ObjectType = (options?: Options): ClassDecorator => {
  return (target) => {
    const types = Reflect.getMetadata(OBJECT_TYPE_METADATA, globalThis) ?? [];

    Reflect.defineMetadata(
      OBJECT_TYPE_METADATA,
      [...types, { target, options }],
      globalThis
    );
  };
};
