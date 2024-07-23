import {
  IApplication as CoreIApplication,
  type IContext,
} from "@nexiojs/common";
import { Application as CoreApplication } from "@nexiojs/core";
import type { TransporterOptions } from "./transporter-options.type.ts";
import type { ClientOptions } from "./client-options.type.ts";

declare module "@nexiojs/common" {
  export interface IApplication extends CoreIApplication {
    connectMicroservices: (
      services: (ClientOptions & { id: string })[]
    ) => Promise<void>;
    createMicroservice: (options: TransporterOptions) => Promise<void>;
  }
}

declare module "@nexiojs/core" {
  export class Application extends CoreApplication<IContext> {
    connectMicroservices: (
      services: (ClientOptions & { id: string })[]
    ) => Promise<void>;
    createMicroservice: (options: TransporterOptions) => Promise<void>;
  }
}
