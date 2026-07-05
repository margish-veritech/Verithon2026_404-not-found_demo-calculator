/*
 * "Pro mode" unlock for the calculator.
 *
 * ⚠️  INTENTIONAL VULNERABILITIES (SentinelForge demo target):
 *   - PRO_SIGNING_SECRET is a hardcoded secret            → Hardcoded Secret (CWE-798)
 *   - verifyProToken() verifies a JWT with a weak literal → Insecure Authentication (CWE-287)
 */
import jwt from "jsonwebtoken";

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
