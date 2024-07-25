import { Adapter, type IAdapterOptions } from "@nexiojs/common";
import {
  Controller,
  Get,
  Injectable,
  createApplication,
  resolveDI,
} from "@nexiojs/core";
import { Client, GrpcClient, IMicroservice } from "@nexiojs/microservice";
import { DenoAdapter } from "@nexiojs/deno-adapter";

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
