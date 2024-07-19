import {
  AUTH_GUARD_METADATA,
  type Constructor,
  type IAuthGuard,
} from "@nexiojs/common";

export const UseAuthGuard = (
  ...authGaurd: Constructor<IAuthGuard>[]
): MethodDecorator => {
  return (target, propertyKey, descriptor) => {
    const authGuards =
      Reflect.getMetadata(AUTH_GUARD_METADATA, descriptor.value as any) ?? [];

    Reflect.defineMetadata(
      AUTH_GUARD_METADATA,
      [...authGuards, ...authGaurd],
      descriptor.value as any
    );
  };
};
