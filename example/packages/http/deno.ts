import { Adapter, type IAdapterOptions } from "@nexiojs/common";
import { Injectable, createApplication, resolveDI } from "@nexiojs/core";
import { Client, GrpcClient } from "@nexiojs/microservice";

@Injectable()
class PersonService {
  @Client("GRPC")
  client!: GrpcClient;

  get() {
    return { name: ["Hello"], id: 1, hasPonycopter: false };
  }
}

const main = async () => {
  class Dummy extends Adapter {
    createServer(options: IAdapterOptions): void {}
  }

  const app = createApplication({
    adapter: Dummy,
  });
  await app.connectMicroservices();

  console.log(
    await resolveDI(PersonService).client.get("PersonService").GetPerson({})
  );
};

main();
