import { FIELD, FIELD_KIND } from "../metadata/symbols.ts";
import { FieldOptions } from "../types/field-options.type.ts";
import { GrpcType } from "../types/field.type.ts";

type ReturnTypeFn = () => GrpcType;

export const Field = (
  fn: ReturnTypeFn,
  options: FieldOptions
): PropertyDecorator => {
  return (target: any, propertyKey: any) => {
    const fields = Reflect.getMetadata(FIELD, target.constructor) ?? [];

    Reflect.defineMetadata(
      FIELD,
      [
        ...fields,
        {
          ...options,
          name: propertyKey,
          // @ts-ignore
          type: fn()[FIELD_KIND],
        },
      ],
      target.constructor
    );
  };
};
