import { Directive, Field, ObjectType } from "@nexiojs/graphql";
import { GraphQLString } from "graphql";

@ObjectType()
@Directive('@key(fields: "id")')
export class User {
  @Field(() => GraphQLString)
  id!: string;

  @Field(() => GraphQLString)
  name!: string;
}
