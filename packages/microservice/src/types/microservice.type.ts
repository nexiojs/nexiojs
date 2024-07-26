import { IApplication, IContext } from "@nexiojs/common";
import type { ClientOptions } from "./client-options.type.ts";
import type { TransporterOptions } from "./transporter-options.type.ts";

export interface IMicroservice extends IApplication<IContext> {
  connectMicroservices: (
    services: (ClientOptions & { id: string })[]
  ) => Promise<void>;
  createMicroservice: (options: TransporterOptions) => Promise<void>;
}
