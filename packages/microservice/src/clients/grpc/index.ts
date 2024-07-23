import type { ServiceClientConstructor } from "@grpc/grpc-js";
import { Client } from "grpc-reflection-js";
import { promisify } from "node:util";
import type { ClientOptions } from "../../types/client-options.type.ts";
import Long from "long";

export class GrpcClient {
  private clientMap: Map<String, InstanceType<ServiceClientConstructor>> =
    new Map();

  constructor(private readonly options: ClientOptions) {}

  async create() {
    const {
      options: { longs },
    } = this.options;
    const pkg = await import("@grpc/grpc-js").then((e) => e.default);
    const loader = await import("@grpc/proto-loader").then((e) => e.default);

    const client = new Client(
      this.options.options.url,
      pkg.credentials.createInsecure()
    );

    const services = await client.listServices();
    const protobufs = await Promise.all(
      services.map((e) => client.fileContainingSymbol(e))
    );

    for (const json of protobufs) {
      const resolved = json.resolveAll();
      // @ts-ignore
      const packageDefinition = loader.fromJSON(resolved, { longs });
      const grpcObject = pkg.loadPackageDefinition(packageDefinition);

      Object.entries(grpcObject).forEach(([key, Service]) => {
        if ("serviceName" in Service) {
          const ServerClient = Service as ServiceClientConstructor;

          const client = new ServerClient(
            this.options.options.url,
            pkg.ChannelCredentials.createInsecure()
          );

          const proxy = new Proxy(client, {
            get(target, p: any, receiver) {
              // @ts-ignore
              if (target[p]?.path) {
                const promise = promisify(target[p]);

                return promise;
              }

              return target[p];
            },
          });

          this.clientMap.set(ServerClient.serviceName, proxy);
        }
      });
    }

    // const protobufSchema = buildProtobuf();
    // const res = protobuf.parse(protobufSchema);
    // const resolved = res.root.resolveAll();
    // const packageDefinition = loader.fromJSON(resolved);
    // this.grpcObject = pkg.loadPackageDefinition(packageDefinition);

    // Object.entries(this.grpcObject).forEach(([key, Service]) => {
    //   if ("serviceName" in Service) {
    //     const ServerClient = Service as ServiceClientConstructor;

    //     const client = new ServerClient(
    //       this.options.options.url,
    //       pkg.ChannelCredentials.createInsecure()
    //     );

    //     const proxy = new Proxy(client, {
    //       get(target, p: any, receiver) {
    //         if ("path" in target[p]) {
    //           const promise = promisify(target[p]).bind(client);
    //           return promise;
    //         }

    //         return target[p];
    //       },
    //     });

    //     this.clientMap.set(ServerClient.serviceName, proxy);
    //   }
    // });

    return this;
  }

  public get<T>(serviceName: string): T {
    return this.clientMap.get(serviceName) as T;
  }
}
