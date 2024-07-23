import { DecoratorKind } from "@nexiojs/common";
import { createPropertyDecorator } from "@nexiojs/core";
import type { ClientOptions } from "../types/client-options.type.ts";

// export const Client = (options: ClientOptions): PropertyDecorator => {
//   return (target: any, propertyKey) => {
//     const clients = Reflect.getMetadata(CUSTOM_PROPERTY, globalThis) ?? [];

//     Reflect.defineMetadata(
//       CUSTOM_PROPERTY,
//       [
//         ...clients,
//         {
//           options,
//           kind: DecoratorKind.MicroserviceClient,
//           key: propertyKey,
//           target: target.constructor,
//         },
//       ],
//       global
//     );
//   };
// };
export const Client = (id: string | symbol) =>
  createPropertyDecorator(
    {
      id,
      kind: DecoratorKind.MicroserviceClient,
    },
    globalThis
  );
