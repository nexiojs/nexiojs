import "reflect-metadata";
import "../polyfills/promise.ts";

import { INJECTABLE_METADATA, type Constructor } from "@nexiojs/common";
import type { InjectableOptions } from "../types/injectable.type.ts";

class Container {
  private instances: Map<any, any> = new Map();

  public get<T = any>(cls: Constructor<T>): T {
    const options: InjectableOptions =
      Reflect.getMetadata(INJECTABLE_METADATA, cls) ?? {};

    if (options?.scope === "REQUEST") {
      return this.createInstance(cls);
    }

    if (!this.instances.has(cls)) {
      const instance = this.createInstance(cls);
      this.instances.set(cls, instance);
    }

    return this.instances.get(cls);
  }

  private createInstance<T = any>(cls: Constructor<T>): T {
    const paramTypes: any[] =
      Reflect.getMetadata("design:paramtypes", cls) ?? [];

    const dependencies = paramTypes.map((paramType) => {
      const Instance = this.get(paramType);

      return Instance;
    });

    const Instance = new cls(...dependencies) as any;
    // Object.getOwnPropertyNames(cls.prototype).forEach((val) => {
    //   if (!IsConstructor(val) && IsFunction(cls.prototype[val])) {
    //     Instance[val] = new Proxy(Instance[val], {
    //       apply: async (target, thisArg, argArray) => {
    //         const result = await Reflect.apply(target, thisArg, argArray);
    //         const rpc = Reflect.getMetadata(CALL_METADATA, target) ?? [];

    //         await Promise.chain(
    //           rpc?.map(({ when, instance, method }: CallOptions) => {
    //             if (when(result)) {
    //               const Instance = this.get(instance);
    //               return resolveParams(Instance[method], {}, Instance);
    //             }
    //           })
    //         );

    //         return result;
    //       },
    //     });
    //   }
    // });

    return Instance;
  }
}

let containerInstance: Container | null = null;

export const getContainer = (): Container => {
  if (!containerInstance) {
    containerInstance = new Container();
  }
  return containerInstance;
};
