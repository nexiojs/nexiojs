import { ApolloGateway, IntrospectAndCompose } from "@apollo/gateway";
import type { IContext } from "@nexiojs/common";
import { createApplication } from "@nexiojs/core";
import { ApolloGraphQLAdapter } from "@nexiojs/graphql";
import { NodeAdapter } from "@nexiojs/node-adapter";

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: "users", url: "http://localhost:3002/graphql" },
      { name: "posts", url: "http://localhost:3001/graphql" },
    ],
  }),
});

export class CORSInterceptor {
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
      gateway,
      adapter: new NodeAdapter(),
    }),
    compress: true,
    interceptors: [CORSInterceptor],
    port: 3000,
  });
};

main();
