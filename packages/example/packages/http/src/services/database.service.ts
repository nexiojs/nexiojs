import { Injectable } from "@nexiojs/core";
import { type NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { ConfigService } from "./config.service";

@Injectable()
export class DatabaseService {
  #pool: Pool;
  db: NodePgDatabase;

  constructor(private readonly configService: ConfigService) {
    this.#pool = new Pool({
      connectionString: configService.get("databaseUrl"),
    });

    this.db = drizzle(this.#pool);
  }
}
