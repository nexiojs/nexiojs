import { Directive, Field, ObjectType } from "@nexiojs/graphql";
import { GraphQLID, GraphQLString } from "graphql";

@ObjectType()
@Directive('@key(fields: "id")')
export class User {
  @Field(() => GraphQLID)
  id!: number;

  @Field(() => GraphQLString)
  name!: string;
}
