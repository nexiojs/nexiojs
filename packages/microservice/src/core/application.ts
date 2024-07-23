import "../types/common.d.ts";

import { CUSTOM_PROPERTY, DecoratorKind } from "@nexiojs/common";
import { Application, resolveDI } from "@nexiojs/core";
import { createClient } from "../clients/create.ts";
import { createMicroservice } from "../create.ts";
import { ClientOptions } from "../types/client-options.type.ts";
import type { TransporterOptions } from "../types/transporter-options.type.ts";

(Application.prototype as any).connectMicroservices = async (
  services: (ClientOptions & { id: string })[]
) => {
  const resolvedClients: Record<string, any> = {};

  await Promise.all(
    services.map(async (e) => {
      const client = await createClient(e);
      resolvedClients[e.id] = client;

      return client;
    })
  );

  const metadata: any[] =
    Reflect.getMetadata(CUSTOM_PROPERTY, globalThis) ?? [];

  const clients = metadata.filter(
    (e) => e.kind === DecoratorKind.MicroserviceClient
  );

  clients.forEach((e, i) => {
    resolveDI(e.target)[e.key] = resolvedClients[e.id];
  });
};

(Application.prototype as any).createMicroservice = async function (
  options: TransporterOptions
) {
  await createMicroservice(this, options);
};
