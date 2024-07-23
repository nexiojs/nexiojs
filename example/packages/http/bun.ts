import "./src/setup.ts";

import { BunAdapter } from "@nexiojs/bun-adapter";
import { createApplication } from "@nexiojs/core";
import { CORSInterceptor } from "./src/interceptors/cors.interceptor.ts";
import { JwtInterceptor } from "./src/interceptors/jwt.interceptor.ts";

const main = async () => {
  const app = createApplication({
    adapter: BunAdapter,
    compress: true,
    interceptors: [JwtInterceptor, CORSInterceptor],
    port: 3000,
  });

  await app.connectMicroservices();
};

main();
