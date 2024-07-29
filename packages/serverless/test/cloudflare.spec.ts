import { ExecutionContext } from "@cloudflare/workers-types";
import { ApplicationOptions } from "@nexiojs/common";
import { Controller, Get, createApplication } from "@nexiojs/core";
import { describe, expect, it } from "bun:test";
import { CloudflareAdapter } from "../src/cloudflare/index.ts";

const IncomingRequest = Request;

const adapter = new CloudflareAdapter();

@Controller("/health")
class HealthController {
  @Get("/")
  health() {
    return "OK";
  }
}

const options: ApplicationOptions = {
  adapter,
};

await createApplication(options);

export const worker = {
  fetch: async (request: Request, env: any, ctx: ExecutionContext) => {
    const res: Response = await adapter.handler(request, env, ctx);

    return res;
  },
};

describe("Hello World worker", () => {
  it("responds with Hello World! (unit style)", async () => {
    const request = new IncomingRequest("http://example.com/health");
    const response = await worker.fetch(
      request,
      {},
      {} as unknown as ExecutionContext
    );
    expect(await response.text()).toBe(`OK`);
  });
});
