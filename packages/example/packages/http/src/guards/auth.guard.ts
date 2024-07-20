import { type IAuthGuard, type IContext } from "@nexiojs/common";
import { Context, Injectable } from "@nexiojs/core";
import { ConfigService } from "../services/config.service";

@Injectable()
export class AuthGuard implements IAuthGuard {
  constructor(private readonly configService: ConfigService) {}

  canActive(@Context() ctx: IContext): boolean | Promise<boolean> {
    const { user } = ctx;

    return user != null;
  }
}
