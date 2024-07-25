import { CALL_METADATA } from "@nexiojs/common";
import { describe, expect, it, jest } from "bun:test";
import { Call } from "../../src/decorators/call.decorator.ts";
import { Context } from "../../src/decorators/context.decorator.ts";
import { Injectable } from "../../src/decorators/injectable.decorator.ts";
import { resolveDI } from "../../src/dependency-injection/resolve.ts";

describe("Call Decorator", () => {
  const result = "Intercepted Result";
  const when = jest.fn((res) => true);
  const fn = jest.fn(() => true);

  @Injectable()
  class A {
    grpc(@Context() ctx: any) {
      console.log("ASDASD");
      ctx = result;
    }
  }

  class Service {
    @Call(A, "grpc", when)
    rpc(@Context() ctx: any) {
      console.log("asdfasdf", ctx);
      ctx = {};
    }
  }

  @Injectable()
  class Controller {
    @Call(Service, "rpc", when)
    async fn() {
      return fn();
    }
  }

  const controller = resolveDI(Controller);

  it("should enrich metatype with CALL metadata", () => {
    const [rpc] = Reflect.getMetadata(CALL_METADATA, controller.fn);

    expect(rpc).toEqual({
      instance: expect.anything(),
      method: "rpc",
      when,
    });
  });

  it("should execute the rpc", async () => {
    await controller.fn();

    expect(fn).toBeCalledTimes(1);
    expect(when).toBeCalledTimes(2);
  });
});
