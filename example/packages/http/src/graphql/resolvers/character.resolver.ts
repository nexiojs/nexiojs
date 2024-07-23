import "../models/human.type";
import "../models/person.type";

import { faker } from "@faker-js/faker";
import { Headers, UseAuthGuard, UseInterceptor } from "@nexiojs/core";
import {
  Args,
  Directive,
  Mutation,
  Parent,
  Query,
  ResolveField,
  ResolveReference,
  Resolver,
} from "@nexiojs/graphql";
import { GraphQLString } from "graphql";
import { User } from "../../decorators/user.decorator";
import { AuthGuard } from "../../guards/auth.guard";
import { JwtInterceptor } from "../../interceptors/jwt.interceptor";
import { LoggingInterceptor } from "../../interceptors/logging.interceptor";
import { PersonService } from "../../services/person.service";
import { UpvotePostInput } from "../inputs/upvote-post.input";
import { Character } from "../models/character.interface";

@Resolver(() => Character)
export class PersonResolver {
  constructor(private readonly personService: PersonService) {}

  @Query(() => Character)
  @UseInterceptor(LoggingInterceptor, JwtInterceptor)
  @UseAuthGuard(AuthGuard)
  hello(
    @Headers("host") host: string,
    @User() user: any,
    @Parent() parent: any
  ) {
    return { id: "1", name: faker.person.fullName() };
  }

  @ResolveField(() => [Character])
  friends() {
    return [{ id: "2" }];
  }

  @ResolveField(() => GraphQLString)
  background(@Parent() parent: any) {
    return faker.person.bio();
  }

  @Mutation(() => Character)
  @Directive(
    `@deprecated(reason: "This query will be removed in the next version")`
  )
  join() {
    return { id: "1", name: "Hello" };
  }

  @Mutation(() => Character)
  async upvotePost(
    @Args("input", { type: () => UpvotePostInput })
    input: UpvotePostInput
  ) {
    return { id: "1" };
  }

  @ResolveReference(() => Character)
  resolveReference(reference: { __typename: string; id: number }) {
    return { id: "3" };
  }
}
