import {
  DEPENDENCY_INJECTION_METADATA,
  type Constructor,
} from "@nexiojs/common";

export const Inject = (clazz: Constructor): ParameterDecorator => {
  return (target: any, key: any, index) => {
    const params =
      Reflect.getMetadata(DEPENDENCY_INJECTION_METADATA, target) ?? [];

    Reflect.defineMetadata(
      DEPENDENCY_INJECTION_METADATA,
      [...params, { index, symbol: clazz }],
      target
    );
  };
};
