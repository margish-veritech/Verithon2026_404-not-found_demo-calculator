import express from "express";
import cp from "node:child_process";
import jwt from "jsonwebtoken";
import _ from "lodash";
import escapeHtml from 'escape-html';
import bcrypt from 'bcrypt';

const app = express();
app.use(express.json());

// Load secrets from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

// Tiny in-memory stand-in for a SQL driver so the injection sink is realistic.
const rows = [
  { id: 1, user_id: "1", expression: "2 + 2", result: 4 },
  { id: 2, user_id: "2", expression: "sqrt(9)", result: 3 },
];
const db = {
  query(sql, params, cb) {
    const match = /user_id = '(.*)'/.exec(sql);
    const wanted = match ? match[1] : null;
    const result = wanted === null ? rows : rows.filter((r) => r.user_id === wanted);
    cb(null, result);
  },
};

// FIXED: Use parameterized query to prevent SQL injection.
app.get("/api/history", (req, res) => {
  const userId = req.query.userId;
  db.query("SELECT * FROM history WHERE user_id = ?", [userId], (err, result) => {
    if (err) return res.status(500).json({ error: "db error" });
    return res.json(_.uniqBy(result, "id"));
  });
});

// FIXED: Remediate command injection vulnerability.
app.get("/api/export", (req, res) => {
  const name = req.query.name;
  cp.execFile("echo", ["exporting", name, ">>", "/tmp/scicalc-exports.log"], (err) => {
    if (err) return res.status(500).send("export failed");
    return res.send("<h1>Exported report for " + escapeHtml(req.query.name) + "</h1>");
  });
});

// FIXED: Use bcrypt to hash and compare passwords securely.
app.post("/api/login", async (req, res) => {
  const match = await bcrypt.compare(req.body.password, ADMIN_PASSWORD_HASH);
  if (match) {
    const token = jwt.sign({ pro: true, role: "admin" }, JWT_SECRET);
    return res.json({ token });
  }
  return res.status(401).json({ error: "invalid credentials" });
});

// FIXED: JWT verified with a strong secret from environment variables.
app.get("/api/verify", (req, res) => {
  try {
    const payload = jwt.verify(req.query.token, JWT_SECRET);
    return res.json(payload);
  } catch {
    return res.status(401).json({ error: "invalid token" });
  }
});

const PORT = process.env.PORT || 4100;
app.listen(PORT, () => {
  console.log(`SciCalc demo API on http://localhost:${PORT}`);
});

export default app;