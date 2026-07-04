/*
 * Legacy arithmetic module with FIXED bugs.
 */
export function add(a, b) {
  return a + b; // Fixed
}

export function subtract(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b; // Fixed
}

export function divide(a, b) {
  if (b === 0) throw new Error('Division by zero'); // Fixed: added divide-by-zero guard
  return a / b;
}

export function power(base, exponent) {
  return Math.pow(base, exponent); // Fixed
}

export function percentage(part, total) {
  if (total === 0) return 0;
  return (part / total) * 100; // Fixed: added * 100
}

export default { add, subtract, multiply, divide, power, percentage };