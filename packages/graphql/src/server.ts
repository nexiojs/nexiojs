import "reflect-metadata";

import {
  Adapter,
  GRAPHQL,
  Kind,
  type ApplicationOptions,
  type Constructor,
  type IApplication,
  type IContext,
  type IInterceptor,
} from "@nexiojs/common";
import { Body, Context, pathToEvent } from "@nexiojs/core";
import { GraphQLSchema, graphql } from "graphql";
import { buildGraphQLSchema } from "./factory/build-graphql.ts";

export type IGraphQLAdapterOptions = {
  application: IApplication<IContext>;
  interceptors: IInterceptor[];
  adapter: Constructor<Adapter>;
} & Omit<ApplicationOptions, "adapter" | "interceptors">;

export class GraphQLAdapter extends Adapter<IGraphQLAdapterOptions> {
  kind: Kind = Kind.GraphQL;
  schema: GraphQLSchema;

  constructor(private readonly adapter: Constructor<Adapter>) {
    super();

    this.schema = buildGraphQLSchema();
  }

  async handle(@Body() body: any, @Context() ctx: IContext) {
    const res = await graphql({
      schema: ctx[GRAPHQL].schema,
      source: body.query,
      contextValue: ctx,
      variableValues: body.variables,
    });
    return res;
  }

  createServer(options: IGraphQLAdapterOptions): void {
    const event = pathToEvent("/graphql", "POST");
    const opts = pathToEvent("/graphql", "OPTIONS");

    [event, opts].forEach((path) => {
      options.application.on(path, this.handle);
      options.application.setRef(path, this);
    });

    const adapter = new this.adapter();

    adapter.createServer({
      ...options,
      makeContext: async (ctx) => {
        ctx[GRAPHQL] = {
          schema: this.schema,
        };

        return ctx;
      },
    });
  }
}
