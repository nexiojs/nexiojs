import { ZodType } from "zod";
import { FieldNode } from "../ast/node";

export type FieldOptions = Omit<FieldNode, "name" | "type"> & {
  validation?: ZodType;
};
