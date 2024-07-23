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
    console.log(body);
    return this.authService.login(body.username, body.password);
  }

  @Post("/register")
  @Call(AuthService, "rollback", (e: any) => e instanceof Error)
  async register() {
    throw new HttpExeception("Dummy", 400);
  }
}
