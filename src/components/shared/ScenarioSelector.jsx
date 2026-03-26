export default function ScenarioSelector({
  activeScenarioId,
  scenarios,
  setActiveScenarioId,
}) {
  return (
    <div className="scenario-toggle" role="tablist" aria-label="Emergency scenarios">
      {scenarios.map((scenario) => (
        <button
          key={scenario.id}
          className={scenario.id === activeScenarioId ? "toggle-pill active" : "toggle-pill"}
          onClick={() => setActiveScenarioId(scenario.id)}
          type="button"
        >
          <span>{scenario.label}</span>
          <small>{scenario.mode}</small>
        </button>
      ))}
    </div>
  );
}
