import { describe, expect, it } from "bun:test";
import { pathToEvent } from "../../src/utils/path-to-event.ts";

describe("Path To Event", () => {
  it("/ [GET] should return GET__/", () => {
    const event = pathToEvent("/", "GET");

    expect(event).toBe("GET__/");
  });

  it("/ [POST] should return POST__/", () => {
    const event = pathToEvent("/", "POST");

    expect(event).toBe("POST__/");
  });

  it("/graphql/ [POST] should return POST__/graphql/", () => {
    const event = pathToEvent("/graphql/", "POST");

    expect(event).toBe("POST__/graphql/");
  });
});
