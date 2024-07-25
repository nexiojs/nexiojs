import type { IContext, IInterceptor } from "@nexiojs/common";
import { Injectable } from "@nexiojs/core";
import { AuthService } from "../services/auth.service.ts";

@Injectable()
export class JwtInterceptor implements IInterceptor {
  constructor(private readonly authService: AuthService) {}

  async pre(ctx: IContext) {
    const authorization = ctx.req.headers.get("authorization");
    if (!authorization) {
      ctx.user = null;
      return;
    }

    const [_, token] = (authorization ?? "").split(" ");

    const user = await this.authService.verify(token);
    ctx.user = user;
  }

  post(ctx: IContext): void | Promise<void> {}
}
