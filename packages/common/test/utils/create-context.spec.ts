import { describe, expect, it } from "bun:test";
import { createContext } from "../../src/utils/create-context";
import { RABBIT_GLOBA_INTERCEPTOR } from "../../src/constants";
import { IInterceptor } from "../../src/interfaces";

class MockInterceptor implements IInterceptor {
  pre(ctx: any): void | Promise<void> {}
  post(ctx: any): void | Promise<void> {}
}

describe("createContext", () => {
  it("should create a context object with expected properties", async () => {
    const request = new Request("http://localhost:3000/api/users");
    const options = {
      application: {} as any,
      port: 3000,
      interceptors: [MockInterceptor],
    };

    const ctx = await createContext(options, request);

    expect(ctx.req).toBeDefined();
    expect(ctx.res).toBeDefined();
    expect(ctx.event).toBe("GET__http://localhost:3000/api/users/");
    expect(ctx[RABBIT_GLOBA_INTERCEPTOR]).toEqual([MockInterceptor]);
  });
});
