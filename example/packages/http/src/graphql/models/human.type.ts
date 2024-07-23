import { Field, ObjectType } from "@nexiojs/graphql";
import { GraphQLString } from "graphql";
import { Character } from "./character.interface";

@ObjectType({
  interfaces: () => [Character],
})
export class Human implements Character {
  id!: string;

  @Field(() => GraphQLString)
  name!: string;
}
