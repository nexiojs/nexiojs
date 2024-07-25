import { Query, ResolveField, Resolver } from "@nexiojs/graphql";
import { GraphQLID } from "graphql";
import { User } from "../models/user.model";
import { faker } from "@faker-js/faker";

@Resolver(() => User)
export class UserResolver {
  @Query(() => [User])
  me(): User[] {
    return [{ id: 1, username: faker.internet.userName() }];
  }

  @ResolveField(() => [GraphQLID])
  posts() {
    return [1, 2, 3];
  }
}
