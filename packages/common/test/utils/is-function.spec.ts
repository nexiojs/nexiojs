import { describe, expect, it } from "bun:test";
import { IsFunction } from "../../src/utils/is-function";

describe("IsFunction", () => {
  class DummyApplication {
    fn() {}
  }

  const methodsNames = Object.getOwnPropertyNames(
    DummyApplication.prototype
  ).filter((e) => e !== "constructor");

  it("should return true", () => {
    const fn =
      DummyApplication.prototype[methodsNames[0] as keyof DummyApplication];

    expect(IsFunction(fn)).toBeTrue();
  });

  it("should return false", () => {
    expect(IsFunction("dummy")).toBeFalse();
  });
});
