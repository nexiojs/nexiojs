import { Body, Call, Controller, Headers, Post } from "@nexiojs/core";
import { AuthService } from "../services/auth.service.ts";
import { HttpExeception } from "@nexiojs/core";

type Credentials = {
  username: string;
  password: string;
};

@Controller("/auth")
export class AuthController {
  constructor(public readonly authService: AuthService) {}

  @Post("/")
  async login(@Body() body: Credentials, @Headers("host") host: string) {
    const res = await this.authService.login(body.username, body.password);

    return res;
  }

  @Post("/register")
  @Call(AuthService, "rollback", (e: any) => true)
  async register(@Body() body: any) {
    throw new HttpExeception("Dummy", 400);
  }
}
