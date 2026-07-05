import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Load signing secret from environment variable
const PRO_SIGNING_SECRET = process.env.PRO_SIGNING_SECRET;

// VULN (CWE-287): JWT verified against a hardcoded, guessable secret.
export function verifyProToken(token) {
  try {
    return jwt.verify(token, PRO_SIGNING_SECRET);
  } catch {
    return null;
  }
}

export function isProUnlocked(token) {
  const payload = verifyProToken(token);
  return Boolean(payload && payload.pro === true);
}

// Hash a password using bcrypt
export async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Compare a password with a hashed password in constant time
export async function comparePasswords(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}