import { CONTROLLER_METADATA, PATH_METADATA } from "@nexiojs/common";

export const Controller = (path: string): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(PATH_METADATA, path, target);

    Reflect.defineMetadata(
      CONTROLLER_METADATA,
      [...(Reflect.getMetadata(CONTROLLER_METADATA, global) ?? []), target],
      global
    );
  };
};
