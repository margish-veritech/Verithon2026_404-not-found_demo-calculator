export default function Display({ expression, result, angleMode, error }) {
  return (
    <div className="display">
      <div className="display-meta">
        <span className={`badge ${angleMode}`}>{angleMode.toUpperCase()}</span>
        {error ? <span className="badge error">ERR</span> : null}
      </div>
      <div className="display-expression">{expression || "0"}</div>
      <div className={`display-result ${error ? "is-error" : ""}`}>
        {error ? error : result !== null ? `= ${result}` : ""}
      </div>
    </div>
  );
}
