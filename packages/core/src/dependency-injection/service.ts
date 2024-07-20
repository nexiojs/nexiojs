import "reflect-metadata";

import { INJECTABLE_METADATA, type Constructor } from "@nexiojs/common";
import type { InjectableOptions } from "src/types/injectable.type";

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

    return new cls(...dependencies);
  }
}

let containerInstance: Container | null = null;

export const getContainer = (): Container => {
  if (!containerInstance) {
    containerInstance = new Container();
  }
  return containerInstance;
};
