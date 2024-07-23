import {
  CUSTOM_METADATA,
  DecoratorKind,
  HEADER_METADATA,
  METHOD_METADATA,
  PATH_METADATA,
} from "@nexiojs/common";
import { describe, expect, it } from "bun:test";
import { Controller } from "../../src/decorators/controller.decorator.ts";
import {
  Body,
  Delete,
  Get,
  Head,
  Header,
  Headers,
  Options,
  Patch,
  Post,
  Put,
} from "../../src/decorators/http.decorator.ts";

@Controller("/")
class TestController {
  @Get("/")
  get(@Headers("host") _: string) {}

  @Post("/")
  @Header("x-response-time", "10")
  post() {}

  @Patch("/")
  patch(@Body() _: any) {}

  @Put("/")
  put() {}

  @Head("/")
  head() {}

  @Delete("/")
  remove() {}

  @Options("/")
  options() {}
}

describe("HTTP Decorator", () => {
  const testController = new TestController();

  it("should enrich metatype with GET metadata", () => {
    const method = Reflect.getMetadata(METHOD_METADATA, testController.get);
    const path = Reflect.getMetadata(PATH_METADATA, testController.get);
    expect(method).toBe("GET");
    expect(path).toBe("/");
  });

  it("should enrich metatype with POST metadata", () => {
    const method = Reflect.getMetadata(METHOD_METADATA, testController.post);
    const path = Reflect.getMetadata(PATH_METADATA, testController.post);
    expect(method).toBe("POST");
    expect(path).toBe("/");
  });

  it("should enrich metatype with PATCH metadata", () => {
    const method = Reflect.getMetadata(METHOD_METADATA, testController.patch);
    const path = Reflect.getMetadata(PATH_METADATA, testController.patch);
    expect(method).toBe("PATCH");
    expect(path).toBe("/");
  });

  it("should enrich metatype with PUT metadata", () => {
    const method = Reflect.getMetadata(METHOD_METADATA, testController.put);
    const path = Reflect.getMetadata(PATH_METADATA, testController.put);
    expect(method).toBe("PUT");
    expect(path).toBe("/");
  });

  it("should enrich metatype with HEAD metadata", () => {
    const method = Reflect.getMetadata(METHOD_METADATA, testController.head);
    const path = Reflect.getMetadata(PATH_METADATA, testController.head);
    expect(method).toBe("HEAD");
    expect(path).toBe("/");
  });

  it("should enrich metatype with DELETE metadata", () => {
    const method = Reflect.getMetadata(METHOD_METADATA, testController.remove);
    const path = Reflect.getMetadata(PATH_METADATA, testController.remove);
    expect(method).toBe("DELETE");
    expect(path).toBe("/");
  });

  it("should enrich metatype with OPTIONS metadata", () => {
    const method = Reflect.getMetadata(METHOD_METADATA, testController.options);
    const path = Reflect.getMetadata(PATH_METADATA, testController.options);
    expect(method).toBe("OPTIONS");
    expect(path).toBe("/");
  });

  it("should enrich metatype with HEADERS metadata", () => {
    const [headers] = Reflect.getMetadata(CUSTOM_METADATA, testController.get);
    expect(headers).toMatchObject({
      key: "get",
      index: 0,
      kind: DecoratorKind.Headers,
    });
  });

  it("should enrich metatype with HEADER metadata", () => {
    const header = Reflect.getMetadata(HEADER_METADATA, testController.post);
    expect(header).toEqual({
      "x-response-time": "10",
    });
  });

  it("should enrich metatype with BODY metadata", () => {
    const [body] = Reflect.getMetadata(CUSTOM_METADATA, testController.patch);
    expect(body).toMatchObject({
      key: "patch",
      index: 0,
      kind: DecoratorKind.Body,
    });
  });
});
