import {
  Context,
  Controller,
  Get,
  Header,
  Post,
  UseAuthGuard,
  UseInterceptor,
} from "@nexiojs/core";
import { AuthGuard } from "../guards/auth.guard.ts";
import { LoggingInterceptor } from "../interceptors/logging.interceptor.ts";
import { DogService } from "../services/dog.service.ts";

@Controller("/dogs")
export class DogController {
  constructor(private readonly dogService: DogService) {}

  @Get("/")
  @Header("Cache-Control", "no-cache")
  woof(@Context() ctx: any) {
    return this.dogService.bark();
  }

  @Post("/")
  @UseAuthGuard(AuthGuard)
  @UseInterceptor(LoggingInterceptor)
  dog() {
    return "";
  }
}
