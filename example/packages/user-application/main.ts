import type { IContext } from "@nexiojs/common";
import { createApplication } from "@nexiojs/core";
import { ApolloGraphQLAdapter } from "@nexiojs/graphql";
import { NodeAdapter } from "@nexiojs/node-adapter";

import "./src/user.resolver.ts";

export class CORSCORSInterceptor {
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
    }),
    compress: true,
    interceptors: [CORSCORSInterceptor],
    port: 3002,
  });
};

main();