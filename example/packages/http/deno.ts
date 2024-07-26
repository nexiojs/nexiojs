import { Controller, Get, Injectable, createApplication } from "@nexiojs/core";
import { DenoAdapter } from "@nexiojs/deno-adapter";
import { Client, GrpcClient, IMicroservice } from "@nexiojs/microservice";

@Injectable()
class PersonService {
  @Client("GRPC")
  client!: GrpcClient;

  get() {
    return { name: ["Hello"], id: 1, hasPonycopter: false };
  }
}

@Controller("/health")
class HealthController {
  @Get("/")
  health() {
    return "OK";
  }
}

const main = async () => {
  const app = await createApplication<IMicroservice>({
    adapter: new DenoAdapter(),
  });

  await app.connectMicroservices([]);
};

main();
