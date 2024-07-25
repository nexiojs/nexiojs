import "reflect-metadata";

import {
  Adapter,
  GRAPHQL,
  Kind,
  type ApplicationOptions,
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
  adapter: Adapter;
} & Omit<ApplicationOptions, "adapter" | "interceptors">;

export class GraphQLAdapter extends Adapter<IGraphQLAdapterOptions> {
  kind: Kind = Kind.GraphQL;
  schema: GraphQLSchema;

  constructor(private readonly adapter: Adapter) {
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

  async createServer(options: IGraphQLAdapterOptions) {
    const event = pathToEvent("/graphql", "POST");
    const opts = pathToEvent("/graphql", "OPTIONS");

    [event, opts].forEach((path) => {
      options.application.on(path, this.handle);
      options.application.setRef(path, this);
    });

    await this.adapter.createServer({
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
