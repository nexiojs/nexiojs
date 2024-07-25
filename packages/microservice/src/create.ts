import type { IApplication, IContext } from "@nexiojs/common";
import { Transporter } from "./enums/index.ts";
import { GrpcTransporter } from "./transporters/index.ts";
import type { TransporterOptions } from "./types/transporter-options.type.ts";

export const createMicroservice = async (
  application: IApplication<IContext>,
  options: TransporterOptions
) => {
  if (options.transpoter === Transporter.Grpc) {
    const grpc = new GrpcTransporter(application);
    await grpc.createServer(options);
  }
};
