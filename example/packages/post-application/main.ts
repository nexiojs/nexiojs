import type { IContext, IInterceptor } from "@nexiojs/common";
import { createApplication } from "@nexiojs/core";
import { ApolloGraphQLAdapter, createUnionType } from "@nexiojs/graphql";
import { NodeAdapter } from "@nexiojs/node-adapter";
import { Post } from "./src/models/post.model";
import { User } from "./src/models/user.model";
import "./src/post.resolver";
import "./src/users/user.resolver";

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

createApplication({
  adapter: new ApolloGraphQLAdapter({
    adapter: NodeAdapter,
    version: "v2.3",
    orphanedTypes: [User],
  }),
  compress: true,
  interceptors: [CORSInterceptor],
  port: 3001,
});
