# SciCalc — Intentionally Vulnerable Scientific Calculator

A polished **React** scientific calculator used as a realistic **scan &
remediation target** for SentinelForge. It ships with intentional, Semgrep-detectable
vulnerabilities across all six v1 categories so the full pipeline (scan → tickets
→ AI planning → draft PR → AI review → human merge → QA → deploy) has real
findings to work on.

> ⚠️ This app is deliberately insecure. Never deploy it to production.

## Run it

```bash
cd demo-calculator
npm install
npm run dev        # scientific calculator UI on http://localhost:3001
npm run server     # optional vulnerable API on http://localhost:4100
npm test           # functional tests for the calculator core
```

## Intentional vulnerabilities

| # | Category (CWE) | Where | Sink |
| - | --- | --- | --- |
| 1 | Code Injection (CWE-95) | `src/calculator.js` | `eval(userExpression)` |
| 2 | DOM XSS (CWE-79) | `src/components/History.jsx` | `dangerouslySetInnerHTML` |
| 3 | Hardcoded Secret (CWE-798) | `src/calculator.js`, `src/auth.js` | `LICENSE_KEY`, `PRO_SIGNING_SECRET` |
| 4 | Insecure Auth (CWE-287) | `src/auth.js`, `server/index.js` | `jwt.verify(token, "secret")`, plaintext password compare |
| 5 | SQL Injection (CWE-89) | `server/index.js` | `db.query("... '" + userId + "'")` |
| 6 | Command Injection (CWE-78) | `server/index.js` | `cp.exec("echo ... " + name)` |
| 7 | Vulnerable Dependency (CWE-1104) | `package.json` | `lodash@4.17.11` |

## Scan it with SentinelForge

Register it as a target, then **Run scan**:

- **Local** (no push needed): register a **Demo App** or **Self Repo** target with
  `localPath` set to this folder's absolute path.
- **GitHub**: push this folder to a **public** repo and register the repo URL as a
  **GitHub Repo** target — SentinelForge clones and scans it.

A plain **URL** target (`http://localhost:3001`) is stored for QA/deploy context
only; it is not source-scanned.

## Note on `npm run demo`

`legacy/arithmetic.js` is a separate module driven by the SentinelForge
`npm run demo --prefix backend` bug-fix walkthrough. That flow overwrites the
legacy module with buggy arithmetic and lets the AI agent fix it — it does **not**
touch the React app in `src/`.
