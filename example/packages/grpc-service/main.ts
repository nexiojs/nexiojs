import {
  Adapter,
  type IAdapterOptions,
  type IAuthGuard,
  type IContext,
} from "@nexiojs/common";
import { Injectable, UseAuthGuard, createApplication } from "@nexiojs/core";
import {
  Bool,
  Field,
  Grpc,
  GrpcMethod,
  Int64,
  Message,
  String,
  Transporter,
  Input,
} from "@nexiojs/microservice";
import { join } from "node:path";
import { z } from "zod";

const host = "0.0.0.0:50051";

@Message()
export class Person {
  @Field(() => String, {
    repeated: true,
    id: 1,
    validation: z.array(z.string().min(8)),
  })
  name!: String[];

  @Field(() => Int64, { id: 2 })
  id!: Int64;

  @Field(() => Bool, { id: 3 })
  hasPonycopter!: boolean;
}

@Injectable()
class AuthGuard implements IAuthGuard {
  canActive(ctx: IContext) {
    return true;
  }
}

@Injectable()
class PersonService {
  get(input: Person) {
    return { name: input.name, id: 1, hasPonycopter: false };
  }
}

@Grpc("PersonService")
class A {
  constructor(private readonly personService: PersonService) {}

  @GrpcMethod(() => Person, { service: "PersonService" })
  @UseAuthGuard(AuthGuard)
  async GetPerson(@Input(() => Person) body: Person): Promise<Person> {
    return this.personService.get(body);
  }
}

const main = async () => {
  class Dummy extends Adapter {
    createServer(options: IAdapterOptions): void {}
  }

  const app = createApplication({
    adapter: Dummy,
  });
  await app.createMicroservice({
    transpoter: Transporter.Grpc,
    options: {
      url: host,
      autoProtoFile: join(__dirname, "schema.proto"),
    },
  });
  // await app.connectMicroservices();

  // try {
  //   const res = await resolveDI(PersonService)
  //     .client.get<PersonService>("PersonService")
  //     .GetPerson({});
  //   console.log(res);
  // } catch (err) {
  //   console.log("aa", err);
  // }
};

main();
