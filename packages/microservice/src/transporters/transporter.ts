import type { TransporterOptions } from "../types/transporter-options.type";

export abstract class ITransporter {
  constructor() {}

  abstract createServer(options: TransporterOptions): Promise<ITransporter>;
}
