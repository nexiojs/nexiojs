import "./src/setup";
import "reflect-metadata"

import { createApplication } from "@nexiojs/core";
import { NodeAdapter } from "@nexiojs/node-adapter";
import { CORSInterceptor } from "./src/interceptors/cors.interceptor";
import { JwtInterceptor } from "./src/interceptors/jwt.interceptor";

createApplication({
  adapter: NodeAdapter,
  compress: true,
  interceptors: [JwtInterceptor, CORSInterceptor],
  port: 3000,
});
