import Calculator from "./components/Calculator.jsx";

export default function App() {
  return (
    <div className="app">
      <Calculator />
      <p className="disclaimer">
        ⚠️ Intentionally vulnerable demo target for SentinelForge — do not deploy to production.
      </p>
    </div>
  );
}
