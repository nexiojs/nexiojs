import { ArgsType, Field } from "@nexiojs/graphql";
import { GraphQLString } from "graphql";

@ArgsType()
export class GetAuthorArgs {
  @Field(() => GraphQLString, { nullable: true, defaultValue: "H" })
  firstName?: string;

  @Field(() => GraphQLString)
  lastName!: string;
}
