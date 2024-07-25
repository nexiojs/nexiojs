import { ZodType } from "zod";
import { FieldNode } from "../ast/node.ts";

export type FieldOptions = Omit<FieldNode, "name" | "type"> & {
  validation?: ZodType;
};
