import { describe, expect, it } from "bun:test";
import { compress } from "../src/compress";
import { IContext } from "../src/interfaces";

describe("compress", () => {
  it("should compress the response body with gzip encoding", () => {
    const ctx = {
      req: { headers: new Headers({ "Accept-Encoding": "gzip" }) },
      res: { body: "Hello world!", headers: new Headers() },
    } as IContext;

    const response = compress({ ctx });

    expect(response.headers.get("Content-Encoding")).toBe("gzip");
    expect(response.body).toBeDefined();
  });

  it("should not compress the response body if no accepted encoding header is present", () => {
    const ctx = {
      req: { headers: new Headers() },
      res: { body: "Hello world!", headers: new Headers() },
    } as IContext;

    const response = compress({ ctx });

    expect(response.headers.get("Content-Encoding")).toBe(undefined);
    expect(response.body).toBeDefined();
  });
});
