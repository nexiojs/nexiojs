import "./src/setup.ts";

import "@nexiojs/bun-adapter";

import { IApplication } from "@nexiojs/common";
import { createApplication } from "@nexiojs/core";
import { IMicroservice } from "@nexiojs/microservice";
import { NodeAdapter } from "@nexiojs/node-adapter";
import { CORSPlugin } from "@nexiojs/plugins";
import { JwtInterceptor } from "./src/interceptors/jwt.interceptor.ts";

const main = async () => {
  const app = await createApplication<IMicroservice & IApplication>({
    adapter: new NodeAdapter(),
    compress: true,
    interceptors: [JwtInterceptor],
    port: 3000,
  });

  app.use(
    new CORSPlugin({
      origin: ["*"],
    })
  );

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
