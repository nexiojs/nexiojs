import { ENUM, ENUM_TYPE_METADATA } from "@nexiojs/common";
import {
  GraphQLEnumType,
  type GraphQLEnumTypeConfig,
  type GraphQLEnumValueConfig,
} from "graphql";

export type CreateEnumTypeConfig = Pick<
  GraphQLEnumTypeConfig,
  "name" | "description"
> & { use?: "value" | "key" };

export const createEnumType = (
  instance: Object,
  config: CreateEnumTypeConfig
) => {
  const enums = Reflect.getMetadata(ENUM_TYPE_METADATA, globalThis) ?? {};

  const values: Record<string, GraphQLEnumValueConfig> = {};

  Object.entries(instance).forEach(([key, val]) => {
    values[key] = { value: val };
  });

  const enumType = new GraphQLEnumType({
    name: config.name,
    values,
  });

  // @ts-ignore
  instance[ENUM] = config.name;

  Reflect.defineMetadata(
    ENUM_TYPE_METADATA,
    { ...enums, [config.name]: enumType },
    globalThis
  );

  return enumType;
};
