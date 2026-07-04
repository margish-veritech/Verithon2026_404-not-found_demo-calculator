/*
 * "Pro mode" unlock for the calculator.
 *
 * ⚠️  INTENTIONAL VULNERABILITIES (SentinelForge demo target):
 *   - PRO_SIGNING_SECRET is a hardcoded secret            → Hardcoded Secret (CWE-798)
 *   - verifyProToken() verifies a JWT with a weak literal → Insecure Authentication (CWE-287)
 */
import jwt from "jsonwebtoken";

// VULN (CWE-798): signing secret hardcoded in shipped client code.
export const PRO_SIGNING_SECRET = "pro-unlock-signing-secret";

// VULN (CWE-287): JWT verified against a hardcoded, guessable secret.
export function verifyProToken(token) {
  try {
    return jwt.verify(token, "secret");
  } catch {
    return null;
  }
}

export function isProUnlocked(token) {
  const payload = verifyProToken(token);
  return Boolean(payload && payload.pro === true);
}
