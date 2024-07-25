import "./src/setup.ts";

import "@nexiojs/bun-adapter";
import { IMicroservice } from "@nexiojs/microservice";

import { createApplication } from "@nexiojs/core";
import { NodeAdapter } from "@nexiojs/node-adapter";
import { CORSInterceptor } from "./src/interceptors/cors.interceptor.ts";
import { JwtInterceptor } from "./src/interceptors/jwt.interceptor.ts";

const main = async () => {
  await createApplication<IMicroservice>({
    adapter: new NodeAdapter(),
    compress: true,
    interceptors: [JwtInterceptor, CORSInterceptor],
    port: 3000,
  });

  // await app.connectMicroservices([
  // {
  //   id: "GRPC",
  //   options: {
  //     url: "0.0.0.0:50051",
  //     longs: String,
  //   },
  //   transporter: Transporter.Grpc,
  // },
  // ]);
};

main();
