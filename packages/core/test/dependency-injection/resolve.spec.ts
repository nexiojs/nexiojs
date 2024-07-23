import { beforeAll, describe, expect, it, jest } from "bun:test";
import { Call } from "../../src/decorators/call.decorator.ts";
import { Context } from "../../src/decorators/context.decorator.ts";
import { Injectable } from "../../src/decorators/injectable.decorator.ts";
import { resolveDI } from "../../src/dependency-injection/resolve.ts";

@Injectable()
class Service {}

describe("Dependency Injection", () => {
  const when = jest.fn((res) => true);
  const fn = jest.fn(() => true);

  @Injectable()
  class Controller {
    constructor(public readonly service: Service) {}
  }

  let controller!: Controller;

  beforeAll(() => {
    controller = resolveDI(Controller);
  });

  it("should init service", async () => {
    expect(controller.service).toBeDefined();
  });
});
