import { GRPC } from "../metadata/symbols.ts";

export const Grpc = (serviceName?: string): ClassDecorator => {
  return (target) => {
    const services = Reflect.getMetadata(GRPC, globalThis) ?? [];

    const name = serviceName ?? target.name;

    Reflect.defineMetadata(
      GRPC,
      [
        ...services,
        {
          name,
          target,
        },
      ],
      globalThis
    );
  };
};
