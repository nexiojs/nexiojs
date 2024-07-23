import { describe, expect, it } from "bun:test";
import { IsConstructor } from "../../src/utils/is-constructor";

describe("IsConstructor", () => {
  class DummyApplication {}
  const methodsNames = Object.getOwnPropertyNames(DummyApplication.prototype);

  it("should return true", () => {
    expect(IsConstructor(methodsNames[0])).toBeTrue();
  });

  it("should return false", () => {
    expect(IsConstructor("dummy")).toBeFalse();
  });
});
