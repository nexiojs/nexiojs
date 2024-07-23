import { INPUT_TYPE_METADATA } from "@nexiojs/common";

type Options = {};

export const InputType = (options?: Options): ClassDecorator => {
  return (target) => {
    const types = Reflect.getMetadata(INPUT_TYPE_METADATA, globalThis) ?? [];

    Reflect.defineMetadata(
      INPUT_TYPE_METADATA,
      [...types, { target, options }],
      globalThis
    );
  };
};
