import { Injectable } from "@nexiojs/core";
import { Client, type GrpcClient } from "@nexiojs/microservice";
import { Person } from "../../../grpc-service/main.ts";
import type { ConfigService } from "./config.service.ts";
import { faker } from "@faker-js/faker";

interface PersonServiceImpl {
  GetPerson(args: Pick<Person, "name">): Person;
}

@Injectable()
export class PersonService {
  constructor(private readonly configService: ConfigService) {}

  @Client("GRPC")
  client!: GrpcClient;

  async get() {
    try {
      const res = await this.client
        .get<PersonServiceImpl>("PersonService")
        .GetPerson({
          name: [faker.person.fullName()],
        });

      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getRandomNumber() {
    return Math.floor(Math.random() * 1000);
  }
}
