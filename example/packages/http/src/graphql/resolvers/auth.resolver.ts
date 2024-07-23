import { Args, Mutation, Resolver } from "@nexiojs/graphql";
import { AuthService } from "../../services/auth.service";
import { LoginInput } from "../inputs/login.input";
import { Tokens } from "../models/tokens.type";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Tokens)
  async login(@Args("input", { type: () => LoginInput }) input: LoginInput) {
    const jwt = await this.authService.login(input.username, input.password);

    return jwt;
  }
}
