import { INJECTABLE_METADATA } from "@nexiojs/common";
import type { InjectableOptions } from "../types/injectable.type.ts";

export const Injectable =
  (options?: InjectableOptions): ClassDecorator =>
  (target) => {
    const scope = options?.scope ?? "SINGLETON";

    Reflect.defineMetadata(INJECTABLE_METADATA, { scope }, target);
  };
