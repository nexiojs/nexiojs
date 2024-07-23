import { Controller, Get, Params } from "@nexiojs/core";
import { AuthService } from "../services/auth.service.ts";

@Controller("/users")
export class UserController {
  constructor(private readonly authService: AuthService) {}

  @Get("/:id")
  // @UseAuthGuard(AuthGuard)
  async getUser(@Params("id") id: string) {
    return {
      id,
    };
  }
}
