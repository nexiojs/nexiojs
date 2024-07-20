import { Field, ObjectType } from "@nexiojs/graphql";
import { GraphQLID } from "graphql";

@ObjectType()
export class Post {
  @Field(() => GraphQLID)
  id!: number;
}
