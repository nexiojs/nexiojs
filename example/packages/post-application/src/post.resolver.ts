import { Args, Mutation, Resolver } from "@nexiojs/graphql";
import { GraphQLBoolean } from "graphql";
import { Direction } from "./enums/direction";

@Resolver()
export class PostResolver {
  @Mutation(() => GraphQLBoolean)
  move(
    @Args("direction", { type: () => Direction }) direction: Direction
  ): boolean {
    return true;
  }
}
