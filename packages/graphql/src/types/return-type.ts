import type { Constructor } from "@nexiojs/common";
import type { GraphQLOutputType } from "graphql";

export type ReturnTypeFunc = (
  of: unknown
) =>
  | Constructor
  | [Constructor]
  | GraphQLOutputType
  | [GraphQLOutputType]
  | Function
  | [Function];
