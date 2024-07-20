import { describe, expect, it } from "bun:test";
import { bodyParser } from "../../src/body-parser";

describe("bodyParser", () => {
  it("should parse JSON request body", async () => {
    const request = new Request("http://localhost:3000", {
      headers: new Headers({ "Content-Type": "application/json" }),
      method: "POST",
      body: JSON.stringify({ name: "John Doe" }),
    });

    const body = await bodyParser(request);

    expect(body).toEqual({ name: "John Doe" });
  });

  it("should parse form-urlencoded request body", async () => {
    const request = new Request("http://localhost:3000", {
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded",
      }),
      method: "POST",
      body: "name=John+Doe",
    });

    const body = await bodyParser(request);

    expect(body).toEqual({ name: "John Doe" });
  });
});
