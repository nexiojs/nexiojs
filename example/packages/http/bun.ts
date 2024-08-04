import "./src/setup.ts";

import { BunAdapter } from "@nexiojs/bun-adapter";
import { createApplication } from "@nexiojs/core";
import { IMicroservice } from "@nexiojs/microservice";
import { CORSInterceptor } from "./src/interceptors/cors.interceptor.ts";
import { JwtInterceptor } from "./src/interceptors/jwt.interceptor.ts";
import { Logger } from "@nexiojs/common";

const main = async () => {
  const app = await createApplication<IMicroservice>({
    adapter: new BunAdapter(),
    compress: true,
    interceptors: [JwtInterceptor, CORSInterceptor],
    port: 3000,
  });

  const logger = new Logger();
  logger.info({ Hello: "World" });
  logger.info({ foo: "bar" }, "baz %s", "qux");
  // await app.connectMicroservices([]);
};

main();
