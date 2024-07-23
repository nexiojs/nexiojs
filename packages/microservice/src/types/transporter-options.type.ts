import type { Transporter } from "../enums/transporter.enum.ts";

export type TransporterOptions = GrpcTransporterOptions;

interface GrpcTransporterOptions {
  transpoter: Transporter;
  options: {
    url: string;
    package?: string;
    autoProtoFile?: string;
  };
}
