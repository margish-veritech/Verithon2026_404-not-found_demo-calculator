import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"";

// Use environment variable for signing secret to avoid hardcoding.
export const PRO_SIGNING_SECRET = process.env.PRO_SIGNING_SECRET;

// Securely verify JWT with a strong secret from environment variables.
export function verifyProToken(token) {
  try {
    return jwt.verify(token, PRO_SIGNING_SECRET);
  } catch {
    return null;
  }
}

// Function to hash passwords securely.
export async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export function isProUnlocked(token) {
  const payload = verifyProToken(token);
  return Boolean(payload && payload.pro === true);
}
