import { FIELD, GRPC, GRPC_METHOD, MESSAGE } from "./metadata/symbols.ts";

import { buildFromAST } from "./ast/build.ts";
import type { MessageNode, Method, Service } from "./ast/node.ts";
import { CUSTOM_METADATA, DecoratorKind } from "@nexiojs/common";
import { resolveDI } from "@nexiojs/core";

export const buildProtobuf = () => {
  const messages: Map<any, MessageNode> = new Map();

  {
    const metadata = Reflect.getMetadata(MESSAGE, globalThis) ?? [];
    for (const message of metadata) {
      messages.set(message.target, {
        name: message.name,
        fields: Reflect.getMetadata(FIELD, message.target),
      });
    }
  }

  const services: Service[] = [];
  {
    const grpcs = Reflect.getMetadata(GRPC, globalThis) ?? [];
    for (const grpc of grpcs) {
      const metadata = Reflect.getMetadata(GRPC_METHOD, grpc.target) ?? {};

      const Instance = resolveDI(grpc.target);

      const methods: Method[] = [];
      for (const { name, returnType } of metadata) {
        const params: any[] =
          Reflect.getMetadata(CUSTOM_METADATA, Instance[name]) ?? [];

        let inputType;

        params.forEach((param) => {
          if (DecoratorKind.GrpcInput === param.kind) {
            inputType = {
              name: param.returnType,
              isStream: param.isStream ?? false,
            };
          }
        });

        methods.push({
          name,
          outputType: { name: returnType.name },
          inputType,
        });
      }

      services.push({ name: grpc.name, methods });
    }
  }

  return buildFromAST({
    enums: [],
    messages: Array.from(messages.values()),
    imports: [],
    version: 3,
    services,
  });
};
