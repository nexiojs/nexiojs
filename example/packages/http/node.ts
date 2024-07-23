import "./src/setup.ts";

import "@nexiojs/bun-adapter";
import { IMicroservice } from "@nexiojs/microservice";

import { faker } from "@faker-js/faker";
import { createApplication, resolveDI } from "@nexiojs/core";
import { Transporter } from "@nexiojs/microservice";
import { NodeAdapter } from "@nexiojs/node-adapter";
import { Person } from "../grpc-service/main.ts";
import { CORSInterceptor } from "./src/interceptors/cors.interceptor.ts";
import { JwtInterceptor } from "./src/interceptors/jwt.interceptor.ts";
import { PersonService } from "./src/services/person.service.ts";

const main = async () => {
  const app: IMicroservice = createApplication({
    adapter: NodeAdapter,
    compress: true,
    interceptors: [JwtInterceptor, CORSInterceptor],
    port: 3000,
  });

  await app.connectMicroservices([
    // {
    //   id: "GRPC",
    //   options: {
    //     url: "0.0.0.0:50051",
    //     longs: String,
    //   },
    //   transporter: Transporter.Grpc,
    // },
  ]);
};

main();
