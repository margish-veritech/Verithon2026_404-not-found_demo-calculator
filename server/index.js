/*
 * Optional API for the SciCalc demo (saved history, export, "pro" unlock).
 *
 * ⚠️  INTENTIONAL VULNERABILITIES (SentinelForge demo target — do NOT ship):
 *   - /api/history   builds SQL via string concatenation   → SQL Injection (CWE-89)
 *   - /api/export    passes input to a shell command        → Command Injection (CWE-78)
 *   - /api/export    reflects req.query into the response    → Reflected XSS (CWE-79)
 *   - /api/login     compares plaintext passwords            → Insecure Auth (CWE-287)
 *   - /api/verify    verifies a JWT with a hardcoded secret  → Insecure Auth (CWE-287)
 *   - JWT_SECRET / ADMIN_PASSWORD are hardcoded              → Hardcoded Secret (CWE-798)
 *
 * Run with `npm run server` (listens on :4100).
 */
import express from "express";
import cp from "node:child_process";
import jwt from "jsonwebtoken";
import _ from "lodash";

const app = express();
app.use(express.json());

// VULN (CWE-798): secrets hardcoded in source.
const JWT_SECRET = "secret";
const ADMIN_PASSWORD = "admin123";

// Tiny in-memory stand-in for a SQL driver so the injection sink is realistic.
const rows = [
  { id: 1, user_id: "1", expression: "2 + 2", result: 4 },
  { id: 2, user_id: "2", expression: "sqrt(9)", result: 3 },
];
const db = {
  query(sql, cb) {
    // Naive matcher; the point is the concatenated `sql` string below.
    const match = /user_id = '(.*)'/.exec(sql);
    const wanted = match ? match[1] : null;
    const result = wanted === null ? rows : rows.filter((r) => r.user_id === wanted);
    cb(null, result);
  },
};

// VULN (CWE-89): SQL built by concatenating untrusted req.query input.
app.get("/api/history", (req, res) => {
  const userId = req.query.userId;
  db.query("SELECT * FROM history WHERE user_id = '" + userId + "'", (err, result) => {
    if (err) return res.status(500).json({ error: "db error" });
    return res.json(_.uniqBy(result, "id"));
  });
});

// FIXED: Use execFile to prevent command injection vulnerability.
app.get("/api/export", (req, res) => {
  const name = req.query.name;
  cp.execFile("echo", ["exporting", name, ">>", "/tmp/scicalc-exports.log"], (err) => {
    if (err) return res.status(500).send("export failed");
    return res.send("<h1>Exported report for " + req.query.name + "</h1>");
  });
});

// VULN (CWE-287): plaintext password comparison; JWT signed with a hardcoded secret.
app.post("/api/login", (req, res) => {
  if (req.body.password == ADMIN_PASSWORD) {
    const token = jwt.sign({ pro: true, role: "admin" }, JWT_SECRET);
    return res.json({ token });
  }
  return res.status(401).json({ error: "invalid credentials" });
});

// VULN (CWE-287): JWT verified with a hardcoded, guessable secret.
app.get("/api/verify", (req, res) => {
  try {
    const payload = jwt.verify(req.query.token, "secret");
    return res.json(payload);
  } catch {
    return res.status(401).json({ error: "invalid token" });
  }
});

const PORT = process.env.PORT || 4100;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`SciCalc demo API on http://localhost:${PORT}`);
});

export default app;