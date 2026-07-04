import DOMPurify from 'dompurify';

/*
 * Calculation history.
 */
export default function History({ entries, onClear, onRecall }) {
  return (
    <aside className="history">
      <div className="history-head">
        <h2>History</h2>
        {entries.length > 0 ? (
          <button type="button" className="history-clear" onClick={onClear}>
            Clear
          </button>
        ) : null}
      </div>

      {entries.length === 0 ? (
        <p className="history-empty">No calculations yet.</p>
      ) : (
        <ul>
          {entries.map((entry, index) => (
            <li key={index} className="history-item" onClick={() => onRecall(entry.expression)}>
              <div
                className="history-expr"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(entry.expression) }}
              />
              <div className="history-result">= {entry.result}</div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
