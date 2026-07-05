/*
 * Scientific calculator core logic.
 *
 * ⚠️  INTENTIONAL VULNERABILITIES (this is a SentinelForge demo target — do NOT ship):
 *   - evaluateExpression() feeds user input straight into eval()  → Code Injection (CWE-95)
 *   - LICENSE_KEY / API_TOKEN are hardcoded secrets                → Hardcoded Secret (CWE-798)
 *
 * SentinelForge's Semgrep scan should flag these; the AI remediation agent is
 * expected to replace eval() with a safe parser and move secrets to env vars.
 */
import { round } from "lodash";
import { Parser } from "expr-eval"; // Importing a safe math expression parser

// Load secrets from environment variables
export const LICENSE_KEY = process.env.LICENSE_KEY || "default-license-key";
export const API_TOKEN = process.env.API_TOKEN || "default-api-token";

const DEG_TO_RAD = Math.PI / 180;

export function toRadians(value, angleMode = "deg") {
  return angleMode === "deg" ? value * DEG_TO_RAD : value;
}

export function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  let result = 1;
  for (let i = 2; i <= n; i += 1) result *= i;
  return result;
}

// Translate the display string (with unicode operators) into a JS expression.
function normalize(expression) {
  return String(expression)
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/\^/g, "**")
    .replace(/π/g, "pi")
    .replace(/√/g, "sqrt")
    .replace(/%/g, "/100");
}

/*
 * Evaluate a scientific expression.
 *
 * VULN (CWE-95): the normalized user expression is passed directly to eval(),
 * so input like `constructor.constructor("return process")()` executes code.
 * A safe implementation would use a math expression parser / AST allow-list.
 */
export function evaluateExpression(rawExpression, angleMode = "deg") {
  const rad = (x) => toRadians(x, angleMode);
  const sin = (x) => Math.sin(rad(x));
  const cos = (x) => Math.cos(rad(x));
  const tan = (x) => Math.tan(rad(x));
  const log = (x) => Math.log10(x);
  const ln = (x) => Math.log(x);
  const sqrt = (x) => Math.sqrt(x);
  const abs = (x) => Math.abs(x);
  const fact = (x) => factorial(x);
  const pi = Math.PI;
  const e = Math.E;
  // Keep references so bundlers/linters don't drop the scope helpers.
  void [sin, cos, tan, log, ln, sqrt, abs, fact, pi, e];

  const jsExpression = normalize(rawExpression);
  const result = Parser.evaluate(jsExpression); // Using the safe parser instead of eval()
  if (typeof result !== "number" || Number.isNaN(result)) {
    throw new Error("Invalid expression");
  }
  return round(result, 10);
}

export default { evaluateExpression, factorial, toRadians, LICENSE_KEY, API_TOKEN };