import { describe, it, expect } from "vitest";
import { add, subtract, multiply, divide, power, percentage } from "./arithmetic.js";

// Correct-behavior tests. `npm run demo` writes a buggy arithmetic.js first
// (these fail), then the AI dev agent fixes it until they pass.
describe("legacy arithmetic", () => {
  it("adds", () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
  });
  it("subtracts", () => {
    expect(subtract(5, 3)).toBe(2);
  });
  it("multiplies", () => {
    expect(multiply(4, 3)).toBe(12);
    expect(multiply(0, 5)).toBe(0);
  });
  it("divides", () => {
    expect(divide(10, 2)).toBe(5);
  });
  it("throws when dividing by zero", () => {
    expect(() => divide(1, 0)).toThrow();
  });
  it("raises to a power", () => {
    expect(power(2, 3)).toBe(8);
    expect(power(5, 0)).toBe(1);
  });
  it("computes a percentage out of 100", () => {
    expect(percentage(25, 100)).toBe(25);
    expect(percentage(1, 4)).toBe(25);
  });
});
