import { describe, expect, it } from "bun:test";
import { IsConstructor } from "../../src/utils/is-constructor";

describe("IsConstructor", () => {
  it("should return true for constructor functions", () => {
    class MyClass {}
    expect(IsConstructor(MyClass.name)).toBe(true);
  });

  it("should return false for non-constructor functions", () => {
    function myFunction() {}
    expect(IsConstructor(myFunction.name)).toBe(false);
  });
});
