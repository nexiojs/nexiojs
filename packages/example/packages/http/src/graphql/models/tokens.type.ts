import { Field, ObjectType } from "@nexiojs/graphql";
import { GraphQLString } from "graphql";

@ObjectType()
export class Tokens {
  @Field(() => GraphQLString)
  accessToken!: string;
}
