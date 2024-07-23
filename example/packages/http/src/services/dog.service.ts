import { Injectable } from "@nexiojs/core";
import { ConfigService } from "./config.service.ts";

@Injectable()
export class DogService {
  constructor(private readonly configService: ConfigService) {}

  bark() {
    return "Woof!";
  }
}
