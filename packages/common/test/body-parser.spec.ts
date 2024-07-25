import { describe, expect, it } from "bun:test";
import { bodyParser } from "../src/body-parser.ts";
import { readFile } from "node:fs/promises";
import { faker } from "@faker-js/faker";

describe("BodyParser", () => {
  const makeRequest = (init?: RequestInit) => {
    return new Request("http://localhost:3000", {
      method: "POST",
      ...init,
    });
  };

  it("application/json should return object", async () => {
    const body = {
      content: faker.lorem.paragraph(),
    };

    const parsed = await bodyParser(
      makeRequest({
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
    );

    expect(parsed).toEqual(body);
  });

  it("application/graphql should return object", async () => {
    const body = {
      query: "...",
      operationName: "...",
      variables: { myVariable: "someValue" },
    };

    const parsed = await bodyParser(
      makeRequest({
        headers: {
          "Content-Type": "application/graphql",
        },
        body: JSON.stringify(body),
      })
    );

    expect(parsed).toEqual(body);
  });

  it("application/x-www-form-urlencoded should return object", async () => {
    const body = "user=123&target=456";

    const parsed = await bodyParser(
      makeRequest({
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      })
    );

    expect(parsed).toEqual({
      user: "123",
      target: "456",
    });
  });

  it("application/x-www-form-urlencoded should return form", async () => {
    const readMe = await readFile("README.md");
    const form = new FormData();
    form.set("user", "123");
    form.set("file", new Blob([readMe]));

    const parsed = await bodyParser(
      makeRequest({
        body: form,
      })
    );

    const file = form.get("file")!;
    const arrayBuffer = await (file as unknown as Blob).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    expect(parsed).toEqual(form);
    expect(buffer.toString("utf8")).toEqual(readMe.toString("utf-8"));
  });

  it("other type should return text", async () => {
    const body = faker.lorem.paragraph();

    const parsed = await bodyParser(
      makeRequest({
        headers: {
          "Content-Type": "application/text",
        },
        body,
      })
    );

    expect(parsed).toEqual(body);
  });
});
