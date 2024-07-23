import { CUSTOM_METADATA, DecoratorKind } from "@nexiojs/common";
import { z } from "zod";
import { FIELD } from "../metadata/symbols";
import { FieldOptions } from "../types/field-options.type";
import { FieldNode } from "../ast/node";

export const generateZod = (fn: Function) => {
  const input: any = Reflect.getMetadata(CUSTOM_METADATA, fn)?.find(
    (e: any) => e.kind === DecoratorKind.GrpcInput
  );

  if (!input) return null;

  const shape: z.ZodRawShape = {};
  const fields: (FieldNode & FieldOptions)[] =
    Reflect.getMetadata(FIELD, input.type) ?? [];

  for (const { name, validation } of fields) {
    if (validation) {
      shape[name] = validation;
    }
  }

  if (Object.keys(shape).length > 0) {
    return z.object(shape);
  }

  return null;
};
