import { Injectable } from "@nexiojs/core";
import { type NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { ConfigService } from "./config.service.ts";

@Injectable()
export class DatabaseService {
  #pool: pg.Pool;
  db: NodePgDatabase;

  constructor(private readonly configService: ConfigService) {
    this.#pool = new pg.Pool({
      connectionString: configService.get("databaseUrl"),
    });

    this.db = drizzle(this.#pool);
  }
}
