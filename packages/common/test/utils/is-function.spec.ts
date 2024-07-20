import { describe, expect, it } from "bun:test";
import { IsFunction } from "../../src/utils/is-function";

describe("IsFunction", () => {
  it("should return true for functions", () => {
    function myFunction() {}
    expect(IsFunction(myFunction)).toBe(true);
  });

  it("should return false for non-functions", () => {
    const myObject = {};
    expect(IsFunction(myObject)).toBe(false);
  });
});
