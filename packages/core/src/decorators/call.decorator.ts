import type { Constructor } from "@nexiojs/common";
import { CALL_METADATA } from "@nexiojs/common";

export const Call = <T extends Constructor, K extends keyof InstanceType<T>>(
  instance: T,
  method: K,
  when: (res: any | Error) => boolean
): MethodDecorator => {
  return (target: any, propertyKey: any, descriptor) => {
    const rpc = Reflect.getMetadata(CALL_METADATA, target[propertyKey]) ?? [];

    Reflect.defineMetadata(
      CALL_METADATA,
      [...rpc, { instance, method, when }],
      target[propertyKey]
    );
  };
};
