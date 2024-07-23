import { MESSAGE } from "../metadata/symbols.ts";

export const Message = (name?: string): ClassDecorator => {
  return (target) => {
    const messages = Reflect.getMetadata(MESSAGE, globalThis) ?? [];

    Reflect.defineMetadata(
      MESSAGE,
      [...messages, { target, name: name ?? target.name }],
      globalThis
    );
  };
};
