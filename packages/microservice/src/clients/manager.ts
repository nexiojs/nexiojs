import { Transporter } from "../enums/transporter.enum.ts";
import type { ClientOptions } from "../types/client-options.type.ts";
import { GrpcClient } from "./grpc/index.ts";

class ClientManager {
  private clients: Map<String, any> = new Map();

  async create(options: ClientOptions) {
    const key = `${options.transporter}_${options.options.url}`;

    if (this.clients.has(key)) return this.clients.get(key);

    if (options.transporter === Transporter.Grpc) {
      const client = await new GrpcClient(options).create();
      this.clients.set(key, client);

      return client;
    }
  }

  getClient(options: ClientOptions) {
    const key = `${options.transporter}_${options.options.url}`;

    if (this.clients.has(key)) return this.clients.get(key);

    return null;
  }
}

let clientManagerInstance: ClientManager | null = null;

export const getClientManager = (): ClientManager => {
  if (!clientManagerInstance) {
    clientManagerInstance = new ClientManager();
  }
  return clientManagerInstance;
};
