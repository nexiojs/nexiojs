import { Controller, Get } from "@nexiojs/core";
import { PersonService } from "../services/person.service.ts";

@Controller("/person")
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get("/")
  async get() {
    return this.personService.get();
  }
}
