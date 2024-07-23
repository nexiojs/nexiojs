import type { GrpcObject, UntypedHandleCall } from "@grpc/grpc-js";
import {
  AUTH_GUARD_METADATA,
  INTERCEPTOR_METADATA,
  RABBIT_AUTH_GUARD,
  RABBIT_INTERCEPTOR,
  createContext,
  type IApplication,
  type IContext,
} from "@nexiojs/common";
import { HttpExeception, resolveDI } from "@nexiojs/core";
import { writeFile } from "node:fs/promises";
import "reflect-metadata";
import type { TransporterOptions } from "../../types/transporter-options.type.ts";
import { ITransporter } from "../transporter.ts";
import type { Service } from "./ast/node.ts";
import { buildProtobuf } from "./build-protobuf.ts";
import { GRPC, GRPC_METHOD } from "./metadata/symbols.ts";
import { generateZod } from "./utils/generate-zod.ts";

export class GrpcTransporter extends ITransporter {
  private grpcObject!: GrpcObject;

  constructor(private readonly application: IApplication<IContext>) {
    super();
  }

  async createServer({ options: { url, autoProtoFile } }: TransporterOptions) {
    const pkg = await import("@grpc/grpc-js").then((e) => e.default);
    const loader = await import("@grpc/proto-loader").then((e) => e.default);
    const protobuf = await import("protobufjs").then((e) => e.default);
    const reflection = await import("@grpc/reflection").then((e) => e.default);

    const protobufSchema = buildProtobuf();
    const res = protobuf.parse(protobufSchema);
    const resolved = res.root.resolveAll();
    const packageDefinition = loader.fromJSON(resolved, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: false,
      oneofs: true,
    });
    this.grpcObject = pkg.loadPackageDefinition(packageDefinition);
    const server = new pkg.Server();

    {
      for (const grpc of Reflect.getMetadata(GRPC, globalThis) ?? []) {
        const ServiceName = grpc.name;
        const Instance = resolveDI(grpc.target);

        const methods: Service[] =
          Reflect.getMetadata(GRPC_METHOD, grpc.target) ?? [];

        const handlers: Record<string, UntypedHandleCall> = {};

        methods.forEach((service) => {
          const methodName = service.name;
          // @ts-ignore
          const event = `__GRPC__${this.grpcObject[ServiceName].service[methodName].path}`;

          const validator = generateZod(Instance[methodName]);

          const fn = Instance[methodName];
          this.application.on(event, fn);
          this.application.setRef(event, Instance);

          handlers[methodName] = async (input: any, callback: any) => {
            try {
              console.log(input.request);
              if (validator) {
                const { error } = await validator.safeParseAsync(input.request);

                if (error) {
                  return callback({
                    status: pkg.status.INVALID_ARGUMENT,
                    code: pkg.status.INVALID_ARGUMENT,
                    message: error.message,
                  });
                }
              }

              const ctx = await createContext(
                {
                  application: this.application,
                  port: 9999,
                  interceptors: [],
                },
                new Request(`http://${url}`, {
                  body: JSON.stringify(input.request),
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    ...input.metadata,
                  },
                })
              );
              ctx.metadata = input.metadata;
              ctx.event = event;
              ctx[RABBIT_AUTH_GUARD] =
                Reflect.getMetadata(AUTH_GUARD_METADATA, fn) ?? [];
              ctx[RABBIT_INTERCEPTOR] =
                Reflect.getMetadata(INTERCEPTOR_METADATA, fn) ?? [];

              const res = await this.application.emitAsync(event, ctx);
              callback(null, res);
            } catch (err: any) {
              const res: Record<string, any> = {
                message: err.message,
              };
              if (err instanceof HttpExeception && err.statusCode == 403) {
                res.status = res.code = pkg.status.UNAUTHENTICATED;
              } else {
                res.status = res.code = pkg.status.INTERNAL;
              }

              callback(res, null);
            }
          };
        });

        // @ts-ignore
        server.addService(this.grpcObject[ServiceName].service, handlers);
      }
    }

    new reflection.ReflectionService(packageDefinition).addToServer(server);

    const port = await new Promise((resolve, reject) => {
      server.bindAsync(
        url,
        pkg.ServerCredentials.createInsecure(),
        (err, port) => {
          if (err) reject(err);

          resolve(port);
        }
      );
    });

    if (autoProtoFile) {
      await writeFile(autoProtoFile, protobufSchema);
    }

    return this;
  }
}
