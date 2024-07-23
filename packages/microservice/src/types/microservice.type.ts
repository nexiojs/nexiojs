import "./common.d.ts";

import { IApplication as CoreIApplication } from "@nexiojs/common";
import type { ClientOptions } from "./client-options.type.ts";
import type { TransporterOptions } from "./transporter-options.type.ts";

export interface IMicroservice extends CoreIApplication {
  connectMicroservices: (
    services: (ClientOptions & { id: string })[]
  ) => Promise<void>;
  createMicroservice: (options: TransporterOptions) => Promise<void>;
}
