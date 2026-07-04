import { useState } from "react";
import Display from "./Display.jsx";
import Keypad from "./Keypad.jsx";
import History from "./History.jsx";
import { evaluateExpression, LICENSE_KEY } from "../calculator.js";

export default function Calculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [angleMode, setAngleMode] = useState("deg");
  const [history, setHistory] = useState([]);

  const appendToken = (token) => {
    setError("");
    setExpression((prev) => prev + token);
  };

  const clearAll = () => {
    setExpression("");
    setResult(null);
    setError("");
  };

  const deleteLast = () => {
    setError("");
    setExpression((prev) => prev.slice(0, -1));
  };

  const compute = () => {
    if (!expression.trim()) return;
    try {
      // VULN path: evaluateExpression() uses eval() on this user input (CWE-95).
      const value = evaluateExpression(expression, angleMode);
      setResult(value);
      setError("");
      setHistory((prev) => [{ expression, result: value }, ...prev].slice(0, 20));
    } catch (err) {
      setError(err.message || "Invalid expression");
      setResult(null);
    }
  };

  return (
    <div className="calculator-shell">
      <div className="calculator">
        <header className="calc-header">
          <div className="brand">
            <span className="brand-mark">∑</span>
            <div>
              <h1>SciCalc</h1>
              <p>Scientific calculator</p>
            </div>
          </div>
          <button
            type="button"
            className="angle-toggle"
            onClick={() => setAngleMode((m) => (m === "deg" ? "rad" : "deg"))}
          >
            {angleMode === "deg" ? "DEG" : "RAD"}
          </button>
        </header>

        <Display expression={expression} result={result} angleMode={angleMode} error={error} />
        <Keypad onToken={appendToken} onClear={clearAll} onDelete={deleteLast} onEquals={compute} />
        <footer className="calc-footer">
          {/* Hardcoded secret referenced in the UI (CWE-798). */}
          <span className="license">license: {LICENSE_KEY.slice(0, 12)}…</span>
        </footer>
      </div>

      <History
        entries={history}
        onClear={() => setHistory([])}
        onRecall={(expr) => setExpression(expr)}
      />
    </div>
  );
}
