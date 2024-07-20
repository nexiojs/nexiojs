import { Injectable } from "@nexiojs/core";

@Injectable()
export class ConfigService {
  constructor() {}

  #config: Record<string, string> = {
    secret: "cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2",
    databaseUrl: "postgresql://pg:pg@127.0.0.1/pg",
  };

  get(name: string) {
    return this.#config[name];
  }
}
