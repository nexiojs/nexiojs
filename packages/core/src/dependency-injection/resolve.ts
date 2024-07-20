// import { DEPENDENCY_INJECTION_METADATA } from "@nexiojs/common";
// import { getContainer } from "./container";

import type { Constructor } from "@nexiojs/common";
import { getContainer } from "./service";

// export const resolveDI = (Instance: any) => {
//   const di: any[] =
//     Reflect.getMetadata(DEPENDENCY_INJECTION_METADATA, Instance) ?? [];

//   const constructorValues: any[] = new Array(di.length);
//   di.forEach(({ index, symbol }) => {
//     const service = getContainer().resolve(symbol);

//     constructorValues[index] = service;
//   });

//   return constructorValues;
// };

export const resolveDI = <T = any>(Instance: Constructor<T>) => {
  return getContainer().get(Instance);
};
