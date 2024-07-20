import { Directive, Field, ObjectType } from "@nexiojs/graphql";
import { GraphQLID, GraphQLString } from "graphql";

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class User {
  @Field(() => GraphQLID)
  @Directive('@external')
  id!: number;

  @Field(() => GraphQLString)
  username!: string;
}
