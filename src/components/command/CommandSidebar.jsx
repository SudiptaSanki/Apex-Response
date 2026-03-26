export default function CommandSidebar({
  activeScenario,
  activeSection,
  onSectionChange,
  sections,
}) {
  return (
    <aside className="command-sidebar">
      <div className="command-sidebar-top">
        <span className="capsule capsule-bright">Incident workspace</span>
        <h3>{activeScenario.label}</h3>
        <p>{activeScenario.location}</p>
      </div>

      <div className="command-side-nav">
        {sections.map((section) => (
          <button
            className={activeSection === section.id ? "command-nav-item is-active" : "command-nav-item"}
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            type="button"
          >
            <strong>{section.label}</strong>
            <span>{section.note}</span>
          </button>
        ))}
      </div>

      <div className="command-sidebar-foot">
        <span className="capsule">Current mode</span>
        <h4>{activeScenario.mode}</h4>
        <p>{activeScenario.kicker}</p>
      </div>
    </aside>
  );
}
