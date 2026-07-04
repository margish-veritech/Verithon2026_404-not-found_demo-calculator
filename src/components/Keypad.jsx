// Scientific keypad layout. Each key either appends a token to the expression,
// clears, deletes, or evaluates.
const KEYS = [
  { label: "sin", token: "sin(" , kind: "fn" },
  { label: "cos", token: "cos(", kind: "fn" },
  { label: "tan", token: "tan(", kind: "fn" },
  { label: "log", token: "log(", kind: "fn" },
  { label: "ln", token: "ln(", kind: "fn" },

  { label: "√", token: "√(", kind: "fn" },
  { label: "x²", token: "^2", kind: "fn" },
  { label: "^", token: "^", kind: "op" },
  { label: "π", token: "π", kind: "fn" },
  { label: "!", token: "fact(", kind: "fn" },

  { label: "C", kind: "action-clear", accent: "danger" },
  { label: "(", token: "(", kind: "op" },
  { label: ")", token: ")", kind: "op" },
  { label: "%", token: "%", kind: "op" },
  { label: "÷", token: "÷", kind: "op", accent: "op" },

  { label: "7", token: "7" }, { label: "8", token: "8" }, { label: "9", token: "9" },
  { label: "DEL", kind: "action-del", accent: "warn" },
  { label: "×", token: "×", kind: "op", accent: "op" },

  { label: "4", token: "4" }, { label: "5", token: "5" }, { label: "6", token: "6" },
  { label: "−", token: "−", kind: "op", accent: "op" },
  { label: "+", token: "+", kind: "op", accent: "op" },

  { label: "1", token: "1" }, { label: "2", token: "2" }, { label: "3", token: "3" },
  { label: "0", token: "0" }, { label: ".", token: "." },
];

export default function Keypad({ onToken, onClear, onDelete, onEquals }) {
  const handle = (key) => {
    if (key.kind === "action-clear") return onClear();
    if (key.kind === "action-del") return onDelete();
    return onToken(key.token);
  };

  return (
    <div className="keypad">
      {KEYS.map((key) => (
        <button
          key={key.label}
          type="button"
          className={`key ${key.accent ? `key-${key.accent}` : ""} ${key.kind === "fn" ? "key-fn" : ""}`}
          onClick={() => handle(key)}
        >
          {key.label}
        </button>
      ))}
      <button type="button" className="key key-equals" onClick={onEquals}>
        =
      </button>
    </div>
  );
}
