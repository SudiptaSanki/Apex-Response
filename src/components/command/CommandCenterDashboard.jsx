import { useEffect, useState } from "react";
import {
  commandDashboardSections,
  getCommandSectionContent,
  getSystemControls,
} from "../../data/commandCenterConfig";
import { useIncidentFeed } from "../../hooks/useIncidentFeed";
import ActivityFeed from "./ActivityFeed";
import CommandSidebar from "./CommandSidebar";
import TimelineRail from "./TimelineRail";
import ScenarioSelector from "../shared/ScenarioSelector";

export default function CommandCenterDashboard({
  activeScenario,
  activeScenarioId,
  demoProperty,
  heatCellStyle,
  liveAlerts,
  scenarios,
  setActiveScenarioId,
  statusTone,
}) {
  const [activeCommandSection, setActiveCommandSection] = useState(
    commandDashboardSections[0].id,
  );
  const sectionContent =
    getCommandSectionContent(activeScenario)[activeCommandSection] ??
    getCommandSectionContent(activeScenario).overview;
  const systemControls = getSystemControls(activeScenario);
  const { activityItems, logEvent, timelineItems } = useIncidentFeed({
    activeScenario,
    liveAlerts,
    property: demoProperty,
  });

  useEffect(() => {
    setActiveCommandSection("overview");
  }, [activeScenario.id]);

  function handleBroadcast() {
    logEvent({
      actor: "Command broadcast",
      kind: "staff",
      message: `${activeScenario.surfaces.staff.primary} confirmed for ${activeScenario.mode.toLowerCase()} mode.`,
      occurredAt: new Date().toISOString(),
      showInTimeline: true,
      sourceLabel: "Command center",
      sourceUrl: "#/command-center",
      title: "Broadcast update issued",
    });
  }

  function handleResponderEscalation() {
    logEvent({
      actor: "Responder escalation",
      kind: "responder",
      message: `${activeScenario.surfaces.responder.primary} shared with field teams.`,
      occurredAt: new Date().toISOString(),
      showInTimeline: true,
      sourceLabel: "Responder handoff",
      sourceUrl: "#/responders",
      title: "Responder handoff escalated",
    });
  }

  return (
    <section className="section command-dashboard-section">
      <div className="section-intro">
        <p className="eyebrow eyebrow-dark">Live command workspace</p>
        <h2>The staff view now behaves like a real operating dashboard.</h2>
        <p>
          Switch scenarios, move through dashboard modules, and track the incident through a
          persistent command shell with a timeline rail and live activity feed.
        </p>
      </div>

      <ScenarioSelector
        activeScenarioId={activeScenarioId}
        scenarios={scenarios}
        setActiveScenarioId={setActiveScenarioId}
      />

      <div className="command-dashboard-shell">
        <CommandSidebar
          activeScenario={activeScenario}
          activeSection={activeCommandSection}
          onSectionChange={setActiveCommandSection}
          sections={commandDashboardSections}
        />

        <div className="command-workspace">
          <div className="command-toolbar">
            <div>
              <span className="capsule capsule-soft">Focused module</span>
              <h3>{sectionContent.title}</h3>
              <p>{sectionContent.body}</p>
            </div>

            <div className="command-toolbar-actions">
              <button className="button-primary" onClick={handleBroadcast} type="button">
                Broadcast update
              </button>
              <button className="button-secondary" onClick={handleResponderEscalation} type="button">
                Escalate responders
              </button>
            </div>
          </div>

          <div className="command-focus-grid">
            {sectionContent.focus.map((item) => (
              <article className="command-main-card command-focus-card" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>

          <div className="command-center-grid">
            <article className="command-main-card command-heatmap-card">
              <div className="panel-heading">
                <span>Occupancy heatmap</span>
                <strong>Room-level visibility</strong>
              </div>

              <div className="heatmap-board">
                {activeScenario.heatmap.map((row) => (
                  <div className="heatmap-row" key={row.floor}>
                    <span className="floor-label">{row.floor}</span>
                    <div className="heatmap-cells">
                      {row.rooms.map((room, index) => (
                        <span
                          className="heatmap-cell"
                          key={`${row.floor}-${index}`}
                          style={heatCellStyle(room, activeScenario.accent)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="command-main-card">
              <div className="panel-heading">
                <span>Priority playbook</span>
                <strong>Immediate action queue</strong>
              </div>
              <div className="route-list command-route-list">
                {activeScenario.route.map((item) => (
                  <div className="route-item" key={item.step}>
                    <span className={`status-dot ${statusTone(item.status)}`} />
                    <p>{item.step}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="command-lower-grid">
            <article className="command-main-card">
              <div className="panel-heading">
                <span>Cross-team handoff</span>
                <strong>Guests, staff, responders</strong>
              </div>
              <div className="handoff-grid">
                {Object.entries(activeScenario.surfaces).map(([key, surface]) => (
                  <article className="handoff-card" key={key}>
                    <span>{surface.title}</span>
                    <strong>{surface.primary}</strong>
                    <p>{surface.blurb}</p>
                  </article>
                ))}
              </div>
            </article>

            <article className="command-main-card">
              <div className="panel-heading">
                <span>System controls</span>
                <strong>Mode-specific overrides</strong>
              </div>
              <div className="control-chip-grid">
                {systemControls.map((control) => (
                  <span className="control-chip" key={control}>
                    {control}
                  </span>
                ))}
              </div>
            </article>
          </div>
        </div>

        <aside className="command-rail">
          <TimelineRail items={timelineItems} />
          <ActivityFeed items={activityItems} />
        </aside>
      </div>
    </section>
  );
}
