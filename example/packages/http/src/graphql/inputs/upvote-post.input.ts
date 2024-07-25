import { Field, InputType } from "@nexiojs/graphql";
import { GraphQLInt } from "graphql";

@InputType()
export class UpvotePostInput {
  @Field(() => GraphQLInt)
  postId!: number;
}
