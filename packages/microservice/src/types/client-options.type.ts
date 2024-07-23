import type { Transporter } from "../enums/transporter.enum";
import { Long } from "@grpc/proto-loader";

export type ClientOptions = GrpcOption;

type GrpcOption = {
  transporter: Transporter.Grpc;
  options: {
    url: string;
    package?: string;
    longs: Long | String | Number;
  };
};
