import { Context, HttpExeception, Injectable } from "@nexiojs/core";
import { sql } from "drizzle-orm";
import { SignJWT, jwtVerify } from "jose";
import { ConfigService } from "./config.service.ts";
import { DatabaseService } from "./database.service.ts";

const alg = "HS256";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService
  ) {}

  async login(username: string, password: string) {
    const { rows } = await this.databaseService.db
      .execute(
        sql`SELECT * FROM users WHERE username = ${username} AND password = ${password}`
      )
      .catch((err) => {
        console.error(err);
        throw err;
      });

    if (rows.length === 0) {
      throw new HttpExeception("Invalid credentails", 403);
    }
    const secret = new TextEncoder().encode(this.configService.get("secret"));
    const jwt = await new SignJWT({ "urn:example:claim": true })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setIssuer("urn:example:issuer")
      .setAudience("urn:example:audience")
      .setExpirationTime("2h")
      .sign(secret);
    return { accessToken: jwt, tokenType: "Bearer" };
  }

  async verify(token: string) {
    const secret = new TextEncoder().encode(this.configService.get("secret"));

    try {
      const { payload, protectedHeader } = await jwtVerify(token, secret, {
        issuer: "urn:example:issuer",
        audience: "urn:example:audience",
      });

      return payload;
    } catch (err) {
      return null;
    }
  }

  async rollback(@Context() ctx: any) {
    console.log("rollback");

    return "";
  }
}
