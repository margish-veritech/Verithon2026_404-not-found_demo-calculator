import { describe, it, expect } from "vitest";
import { evaluateExpression, factorial, toRadians } from "./calculator.js";

// Functional tests for the scientific calculator core. (Security defects such as
// the eval() code-injection sink are validated by the SentinelForge scan, not here.)
describe("scientific calculator core", () => {
  it("evaluates basic arithmetic with unicode operators", () => {
    expect(evaluateExpression("2 + 3")).toBe(5);
    expect(evaluateExpression("6 × 7")).toBe(42);
    expect(evaluateExpression("10 ÷ 4")).toBe(2.5);
  });

  it("supports powers and roots", () => {
    expect(evaluateExpression("2 ^ 10")).toBe(1024);
    expect(evaluateExpression("sqrt(144)")).toBe(12);
  });

  it("evaluates trig functions in degrees", () => {
    expect(evaluateExpression("sin(90)", "deg")).toBe(1);
    expect(evaluateExpression("cos(0)", "deg")).toBe(1);
  });

  it("computes factorials", () => {
    expect(factorial(5)).toBe(120);
    expect(factorial(0)).toBe(1);
  });

  it("converts degrees to radians", () => {
    expect(toRadians(180, "deg")).toBeCloseTo(Math.PI, 10);
    expect(toRadians(1, "rad")).toBe(1);
  });

  it("throws on an invalid expression", () => {
    expect(() => evaluateExpression("2 +")).toThrow();
  });
});
