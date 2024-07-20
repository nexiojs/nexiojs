import { describe, expect, it } from "bun:test";
import { GraphQLInt, GraphQLString, graphql } from "graphql";
import { ObjectType, buildGraphQLSchema } from "../src";
import { Query } from "../src/decorators";
import { Field } from "../src/decorators/field";
import { Resolver } from "../src/decorators/resolver";

@ObjectType()
export class Person {
  @Field(() => GraphQLInt)
  age!: number;

  @Field(() => GraphQLString)
  name!: string;
}

class PersonService {
  get() {
    return { age: 1 };
  }
}

@Resolver()
export class PersonResolver {
  constructor(private readonly personService: PersonService) {}

  @Query(() => Person)
  hello() {
    return this.personService.get();
  }
}

describe("Build GraphQL Schema", () => {
  const schema = buildGraphQLSchema();

  it("Should return age", async () => {
    const result = await graphql({ schema, source: "{ hello { age }  }" });

    const hello = result.data!.hello as any;
    expect(hello.age).toBe(1);
  });
});
