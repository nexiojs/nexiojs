import type { Constructor } from "@nexiojs/common";
import { GRPC_METHOD } from "../metadata/symbols.ts";

type ReturnTypeFn = () => Constructor;
type Options = {};

export const GrpcMethod = (
  returns: ReturnTypeFn,
  options?: Options
): MethodDecorator => {
  return (target, propertyKey: any, descriptor) => {
    const grpcs = Reflect.getMetadata(GRPC_METHOD, target.constructor) ?? [];
    const returnType = returns().name;

    // const clsName =
    //   typeof options.service === "string"
    //     ? options.service
    //     : options.service.name;

    Reflect.defineMetadata(
      GRPC_METHOD,
      [
        ...grpcs,
        {
          name: propertyKey,
          returnType: returns(),
          options,
        },
        // [clsName]: {
        //   name: clsName,
        //   methods: [
        //     ...(grpcs[clsName]?.methods ?? []),
        //     {
        //       name: propertyKey,
        //       // inputType: '',
        //       outputType: returnType,
        //     },
        //   ],
        //   handlers: {
        //     ...grpcs[clsName]?.handlers,
        //     [propertyKey]: descriptor.value,
        //   },
        // },
      ],
      target.constructor
    );
  };
};
