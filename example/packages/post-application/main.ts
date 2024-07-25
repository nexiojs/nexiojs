import type { IContext, IInterceptor } from "@nexiojs/common";
import { createApplication } from "@nexiojs/core";
import { ApolloGraphQLAdapter, createUnionType } from "@nexiojs/graphql";
import { NodeAdapter } from "@nexiojs/node-adapter";
import { Post } from "./src/models/post.model.ts";
import { User } from "./src/models/user.model.ts";
import "./src/post.resolver.ts";
import "./src/users/user.resolver.ts";

export const ResultUnion = createUnionType({
  name: "ResultUnion",
  types: () => [User, Post],
});

export class CORSInterceptor implements IInterceptor {
  constructor() {}

  async pre(ctx: IContext) {
    ctx.res.headers.set("Access-Control-Allow-Origin", "*");
    ctx.res.headers.set("Access-Control-Allow-Headers", "*");
  }

  post(ctx: IContext): void | Promise<void> {}
}

const main = async () => {
  await createApplication({
    adapter: new ApolloGraphQLAdapter({
      adapter: new NodeAdapter(),
      version: "v2.3",
      orphanedTypes: [User],
    }),
    compress: true,
    interceptors: [CORSInterceptor],
    port: 3001,
  });
};

main();
