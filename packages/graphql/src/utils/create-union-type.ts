import { UNION_TYPE_METADATA, type Constructor } from "@nexiojs/common";
import { type GraphQLOutputType, type GraphQLUnionTypeConfig } from "graphql";

export type CreateUnionTypeConfig = Omit<
  GraphQLUnionTypeConfig<any, any>,
  "types"
> & {
  types: () => (GraphQLOutputType | Constructor)[];
};

export const createUnionType = (config: CreateUnionTypeConfig) => {
  const types = Reflect.getMetadata(UNION_TYPE_METADATA, global) ?? [];

  Reflect.defineMetadata(UNION_TYPE_METADATA, [...types, config], global);
};
