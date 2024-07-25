import "reflect-metadata";
import "../polyfills/promise.ts";

import {
  CALL_METADATA,
  INJECTABLE_METADATA,
  IsConstructor,
  IsFunction,
  resolveParams,
  type Constructor,
} from "@nexiojs/common";
import last from "lodash.last";
import type { CallOptions } from "../types/call.type.ts";
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
    Object.getOwnPropertyNames(cls.prototype).forEach((val) => {
      if (!IsConstructor(val) && IsFunction(cls.prototype[val])) {
        const rpc = Reflect.getMetadata(CALL_METADATA, Instance[val]) ?? [];

        if (rpc.length === 0) return;

        const runChain = async (result: any, argArray: any) => {
          const ctx = last(argArray);

          await Promise.chain(
            rpc?.map(({ when, instance, method }: CallOptions) => {
              if (when(result)) {
                const Instance = this.get(instance);
                return resolveParams(Instance[method], ctx, Instance);
              }
            })
          );
        };

        const proxyFn = new Proxy(Instance[val], {
          get(target, p, receiver) {
            return target[p];
          },
          apply: async (target: any, thisArg: any, argArray: any) => {
            try {
              const result = await Reflect.apply(target, thisArg, argArray);
              await runChain(result, argArray);

              return result;
            } catch (err) {
              await runChain(err, argArray);

              return err;
            }
          },
        });

        const keys = Reflect.getMetadataKeys(Instance[val]);
        keys.forEach((key) => {
          const metadata = Reflect.getMetadata(key, Instance[val]);
          Reflect.defineMetadata(key, metadata, proxyFn);
        });

        Instance[val] = proxyFn;
      }
    });

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
