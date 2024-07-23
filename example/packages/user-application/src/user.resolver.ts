import {
  Query,
  ResolveField,
  ResolveReference,
  Resolver,
} from "@nexiojs/graphql";
import { User } from "./models/user";
import { GraphQLString } from "graphql";
import { Reference } from "@nexiojs/graphql";

@Resolver(() => User)
export class UserResolver {
  @Query(() => GraphQLString, { description: "Hello my friend" })
  hello() {
    return "";
  }

  @ResolveReference(() => User)
  resolveReference(
    @Reference() reference: { __typename: string; id: number }
  ): User {
    return { id: reference.id, name: "ZZZ" };
  }

  @ResolveField(() => GraphQLString)
  background() {
    return "Hello World";
  }
}
