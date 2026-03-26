import { useEffect, useState } from "react";
import CommandCenterDashboard from "./components/command/CommandCenterDashboard";
import ScenarioSelector from "./components/shared/ScenarioSelector";
import { demoProperty, fetchActiveAlertsByPoint } from "./nws";
import { phaseOneTasks } from "./phaseOneTasks";

const scenarios = [
  {
    id: "storm",
    label: "Coastal storm",
    kicker: "Auto-triggered from public weather alerts",
    title: "Severe weather pushes the hotel into coordinated shelter mode.",
    summary:
      "AegisStay turns a live hazard alert into clear guest instructions, staff accountability, and a responder-ready operating picture in under a minute.",
    alert: "NWS severe thunderstorm warning within 1.2 miles",
    location: "Goa Coast Demo Property",
    mode: "Shelter in place",
    responseTime: "00:28",
    accent: "84, 208, 188",
    metrics: [
      { label: "Guests in-house", value: "214" },
      { label: "Acknowledged", value: "79%" },
      { label: "Assembly points", value: "2 open" },
      { label: "Responder ETA", value: "6 min" },
    ],
    heatmap: [
      { floor: "L8", rooms: [0.1, 0.16, 0.34, 0.4, 0.22, 0.12] },
      { floor: "L7", rooms: [0.2, 0.26, 0.52, 0.74, 0.48, 0.2] },
      { floor: "L6", rooms: [0.12, 0.3, 0.66, 0.8, 0.58, 0.24] },
      { floor: "L5", rooms: [0.1, 0.22, 0.42, 0.56, 0.28, 0.18] },
    ],
    route: [
      { step: "Move guests on ocean-facing rooms to interior corridors", status: "clear" },
      { step: "Open ballroom as refuge point for mobility support", status: "assist" },
      { step: "Hold elevator use and route staff to Stairwell C", status: "clear" },
      { step: "Keep west service entrance free for emergency vehicles", status: "watch" },
    ],
    surfaces: {
      guest: {
        title: "Guest PWA",
        blurb:
          "Push notifications land in the guest's phone language with a simple route card, refuge room details, and a one-tap safe status.",
        primary: "Open refuge route",
        secondary: "Mark my party safe",
        bullets: [
          "Offline-ready emergency card cached on install",
          "Large-type instructions for low-visibility conditions",
          "QR muster check-in updates staff headcount instantly",
        ],
      },
      staff: {
        title: "Command Center",
        blurb:
          "Managers see occupancy confidence by floor, unresolved assistance requests, and system-generated playbooks before panic spreads.",
        primary: "Activate shelter workflow",
        secondary: "Broadcast to all zones",
        bullets: [
          "Live roster blends PMS occupancy and Wi-Fi presence",
          "Priority queue highlights children, seniors, and inaccessible rooms",
          "Simulator mode can inject alarms when hardware is unavailable",
        ],
      },
      responder: {
        title: "Responder Link",
        blurb:
          "A secure expiring link gives dispatch and incoming crews the floor pack, hazard notes, and live status without requiring a hotel login.",
        primary: "Open building brief",
        secondary: "Share staging note",
        bullets: [
          "Hazard locations include fuel, pool chemicals, and shutoffs",
          "Ingress points and refuge rooms are pinned before arrival",
          "Link can degrade gracefully to a lightweight read-only fallback",
        ],
      },
    },
  },
  {
    id: "smoke",
    label: "Smoke event",
    kicker: "Localized fire turns into dynamic evacuation",
    title: "A kitchen smoke incident reroutes guests away from a blocked corridor.",
    summary:
      "Instead of relying on static paper maps, the platform updates routes floor by floor and gives staff a live accountability view as smoke conditions change.",
    alert: "Back-of-house smoke spread from service kitchen on Level 2",
    location: "Urban Business Hotel",
    mode: "Partial evacuation",
    responseTime: "00:19",
    accent: "241, 138, 81",
    metrics: [
      { label: "Guests in affected zone", value: "63" },
      { label: "Safe check-ins", value: "44" },
      { label: "SOS calls", value: "3" },
      { label: "Fire crew ETA", value: "4 min" },
    ],
    heatmap: [
      { floor: "L6", rooms: [0.08, 0.14, 0.16, 0.24, 0.12, 0.08] },
      { floor: "L5", rooms: [0.12, 0.22, 0.28, 0.36, 0.24, 0.18] },
      { floor: "L4", rooms: [0.18, 0.34, 0.56, 0.7, 0.42, 0.2] },
      { floor: "L3", rooms: [0.24, 0.44, 0.82, 0.9, 0.6, 0.28] },
    ],
    route: [
      { step: "Reroute east wing guests to Stairwell B", status: "reroute" },
      { step: "Disable route through banquet corridor due to smoke", status: "watch" },
      { step: "Dispatch floor wardens with evacuation sweep checklist", status: "assist" },
      { step: "Auto-unlock emergency exits on Levels 2 through 4", status: "clear" },
    ],
    surfaces: {
      guest: {
        title: "Guest PWA",
        blurb:
          "The emergency card flips from shelter mode to evacuation mode with a fresh route, bold visual cues, and a one-tap SOS option.",
        primary: "View smoke-safe exit",
        secondary: "Send SOS",
        bullets: [
          "Indoor route excludes blocked corridors in real time",
          "Multilingual audio prompt supports low-vision navigation",
          "Family mode keeps connected bookings grouped together",
        ],
      },
      staff: {
        title: "Command Center",
        blurb:
          "Teams can see which hallways remain occupied, which rooms have acknowledged evacuation, and where extra sweep support is needed.",
        primary: "Open evacuation board",
        secondary: "Dispatch sweep teams",
        bullets: [
          "Heatmap intensity changes as routes and room states update",
          "Manual overrides let security close unsafe areas instantly",
          "Assembly headcount reconciles checked-in guests against occupancy",
        ],
      },
      responder: {
        title: "Responder Link",
        blurb:
          "Crews arrive with a floor-aware map, room status confidence, and pre-marked utility shutoffs instead of walking in blind.",
        primary: "Review utility map",
        secondary: "Track incoming crew",
        bullets: [
          "Stairwell and hydrant access notes are visible by floor",
          "Latest CCTV snapshots can be attached if available",
          "Unresolved SOS markers stay pinned until cleared",
        ],
      },
    },
  },
  {
    id: "threat",
    label: "Security threat",
    kicker: "Fast lockdown with controlled responder visibility",
    title: "An active security incident demands instant lockdown and room-level accountability.",
    summary:
      "AegisStay gives leadership a calm command surface for controlled comms, safe-room instructions, and a selective responder briefing without exposing guest data broadly.",
    alert: "Suspicious armed individual reported near west lobby entrance",
    location: "Convention District Hotel",
    mode: "Lockdown",
    responseTime: "00:12",
    accent: "98, 153, 255",
    metrics: [
      { label: "Occupied rooms", value: "188" },
      { label: "Safe-room confirmations", value: "121" },
      { label: "Open incidents", value: "5" },
      { label: "Police ETA", value: "3 min" },
    ],
    heatmap: [
      { floor: "L9", rooms: [0.08, 0.12, 0.18, 0.16, 0.1, 0.08] },
      { floor: "L8", rooms: [0.12, 0.2, 0.24, 0.26, 0.18, 0.12] },
      { floor: "L2", rooms: [0.24, 0.36, 0.68, 0.84, 0.52, 0.26] },
      { floor: "L1", rooms: [0.3, 0.52, 0.82, 0.92, 0.6, 0.28] },
    ],
    route: [
      { step: "Lock west lobby access and staff entrances", status: "clear" },
      { step: "Guide guest devices to nearest secure room, not exits", status: "reroute" },
      { step: "Silence nonessential alarms to reduce panic", status: "watch" },
      { step: "Share selective camera and floor feed with police", status: "assist" },
    ],
    surfaces: {
      guest: {
        title: "Guest PWA",
        blurb:
          "The guest interface shifts into calm, minimal instructions with safe-room guidance and no information that could worsen the threat.",
        primary: "Open secure room guide",
        secondary: "Quiet SOS",
        bullets: [
          "Silent acknowledgement protects guests in hiding",
          "Translations focus on short controlled safety phrases",
          "Safe-room route can work without continuous connectivity",
        ],
      },
      staff: {
        title: "Command Center",
        blurb:
          "Security and management coordinate lockdown zones, open welfare checks, and responder handoff from a single view instead of chasing radio traffic.",
        primary: "Initiate lockdown",
        secondary: "Open welfare queue",
        bullets: [
          "Door, floor, and guest status are grouped by threat radius",
          "Manual notes help track rooms needing medical or mobility support",
          "Leadership gets one timeline of alerts, actions, and acknowledgements",
        ],
      },
      responder: {
        title: "Responder Link",
        blurb:
          "Police receive the exact zones, access paths, and confirmed room statuses they need without waiting for an in-person brief.",
        primary: "Open tactical brief",
        secondary: "Pin cleared zones",
        bullets: [
          "Sensitive links expire quickly and can be revoked by command",
          "Only mission-critical room and camera context is shared",
          "Responder notes sync back into the hotel timeline in real time",
        ],
      },
    },
  },
];

const signalPillars = [
  {
    title: "Public hazard triggers",
    label: "NWS + all-hazards ready",
    text: "Real geo-fenced weather alerts can open incidents automatically, while the platform stays extensible for broader public warning feeds.",
  },
  {
    title: "Historical resilience context",
    label: "OpenFEMA risk intelligence",
    text: "Declarations, mitigation projects, and regional history help hotels tune preparedness playbooks instead of reacting blindly.",
  },
  {
    title: "Indoor routing engine",
    label: "Floor-aware navigation",
    text: "Indoor wayfinding feeds dynamic routes around smoke, blocked stairs, and safe-room rules where GPS simply fails.",
  },
  {
    title: "Responder operations realism",
    label: "Dispatch and staging overlays",
    text: "Public station and incident datasets can enrich ETA, staging, and local-response storytelling during the demo.",
  },
];

const capabilities = [
  {
    title: "One operating picture",
    body: "Guests, hotel teams, and incoming responders all work from the same incident object, with permissions tuned to what each group actually needs.",
  },
  {
    title: "Modern hotel-ready UX",
    body: "A polished hospitality-first interface replaces back-office emergency tooling with something calm, premium, and legible under stress.",
  },
  {
    title: "Simulation-friendly",
    body: "If locks, Wi-Fi triangulation, or CCTV integrations are not available during the hackathon, a simulator can still prove the decision layer convincingly.",
  },
];

const adaptationCards = [
  {
    title: "Tailor it for a new property",
    body: "Swap the demo location, scenarios, and route logic to adapt the platform for resorts, boutique hotels, or multi-building properties.",
  },
  {
    title: "Repurpose it beyond hotels",
    body: "The same incident model can support campuses, hospitals, cruise terminals, stadiums, and convention centers with minimal concept changes.",
  },
  {
    title: "Extend the data layer",
    body: "Add OpenFEMA context, indoor mapping, public dispatch overlays, or a Supabase backend without replacing the existing UI foundation.",
  },
];

const implementationPhases = [
  {
    name: "Detect",
    detail: "Poll live alerts, ingest hotel telemetry, and create one incident record with severity, property context, and recommended playbook.",
  },
  {
    name: "Coordinate",
    detail: "Broadcast guest-safe instructions, expose staff actions, and track acknowledgements, SOS requests, and floor-level occupancy confidence.",
  },
  {
    name: "Respond",
    detail: "Share a secure responder brief, route around blocked zones, and maintain one live timeline of decisions and field updates.",
  },
  {
    name: "Prove",
    detail: "Reconcile assembly headcounts, preserve the incident log, and surface time-to-notification and accountability metrics for post-incident review.",
  },
];

const roadmap = [
  "AR floor arrows for guided evacuation",
  "Bluetooth mesh fallback for no-network safe and SOS status",
  "IoT controls for locks, lighting, and alarm presets",
  "Direct PMS and CCTV vendor integrations",
  "Family reunification and welfare board",
  "Accessibility-first evacuation mode",
  "After-action reporting and audit export",
  "Backup power and utility readiness panel",
  "Air quality and wildfire smoke response mode",
  "Staff floor-warden task assignments",
];

const siteRoutes = [
  { path: "/", label: "Home", navLabel: "Overview" },
  { path: "/platform", label: "Platform", navLabel: "Platform" },
  { path: "/guest-app", label: "Guest app", navLabel: "Guest app" },
  { path: "/command-center", label: "Command center", navLabel: "Command center" },
  { path: "/responders", label: "Responders", navLabel: "Responders" },
];

const pageCards = [
  {
    path: "/platform",
    title: "Platform architecture",
    body: "See how live signals, simulator inputs, and hotel operations converge into one incident pipeline.",
  },
  {
    path: "/guest-app",
    title: "Guest mobile experience",
    body: "Explore multilingual alerts, safe check-ins, indoor routing, and future offline resilience features.",
  },
  {
    path: "/command-center",
    title: "Staff command center",
    body: "Review occupancy heatmaps, command actions, floor sweeps, and accountability workflows.",
  },
  {
    path: "/responders",
    title: "Responder link",
    body: "Walk through the digital Knox Box, hazard brief, ingress notes, and pre-arrival coordination view.",
  },
];

const guestExperienceIdeas = [
  {
    title: "Multilingual calm mode",
    body: "Push alerts, large-type instructions, and optional audio guidance adapt to the device language and urgency level.",
  },
  {
    title: "Accessible route cards",
    body: "Wheelchair-safe exits, refuge spaces, and low-visibility instructions can be rendered as alternate route plans instead of one-size-fits-all maps.",
  },
  {
    title: "Family and group coordination",
    body: "Connected bookings can stay linked during an incident so guardians and staff know who is still unaccounted for as one group.",
  },
  {
    title: "Offline readiness roadmap",
    body: "Bluetooth mesh relay, cached route cards, and SMS fallback give the guest experience resilience when infrastructure is degraded.",
  },
];

const commandCenterModules = [
  {
    title: "Live occupancy confidence",
    body: "Blend PMS occupancy, Wi-Fi presence, and staff sweep confirmations into one heatmap instead of trusting any single source.",
  },
  {
    title: "Operational mode control",
    body: "Evacuation, shelter, and lockdown modes can publish policy changes, route updates, and building-system intents from one command panel.",
  },
  {
    title: "Assembly accountability",
    body: "QR, manual roster, and sweep-team updates roll into a single accountability board so staff know who still needs help.",
  },
  {
    title: "Training and simulator mode",
    body: "The same dashboard can power drills, tabletop exercises, and hardware-light demos by injecting scripted incident data.",
  },
];

const responderModules = [
  {
    title: "Digital Knox Box",
    body: "Share an expiring responder link with floor packs, stairwells, hazard notes, shutoffs, and live room status confidence.",
  },
  {
    title: "Ingress and staging brief",
    body: "Show vehicle access, staging areas, hydrants, and closed entrances before crews arrive at the property.",
  },
  {
    title: "Shared field timeline",
    body: "Dispatch, hotel staff, and on-site teams can align on incident changes without repeating the same updates over phone calls.",
  },
  {
    title: "Fallback-safe delivery",
    body: "Even if advanced media is unavailable, the responder view can collapse to a lightweight status page that still carries the essentials.",
  },
];

const commandModes = [
  {
    title: "Evacuation mode",
    label: "Movement-first",
    body: "Unlock exits, illuminate floor guidance, reroute around blocked zones, and reconcile assembly check-ins as people move outside.",
  },
  {
    title: "Shelter mode",
    label: "Protection-first",
    body: "Keep guests indoors, designate refuge zones, pause elevators when needed, and send calm multilingual instructions that reduce hallway congestion.",
  },
  {
    title: "Lockdown mode",
    label: "Threat-containment",
    body: "Control access points, narrow the information surface, protect guest privacy, and share selective tactical details only with responders who need them.",
  },
];

const NWS_REFRESH_INTERVAL_MS = 5 * 60 * 1000;

function getRouteFromHash(hashValue) {
  const route = hashValue.replace(/^#/, "") || "/";
  return siteRoutes.some((item) => item.path === route) ? route : "/";
}

function statusTone(status) {
  if (status === "clear") return "status-green";
  if (status === "assist") return "status-amber";
  if (status === "reroute") return "status-blue";
  return "status-red";
}

function heatCellStyle(level, accent) {
  const opacity = 0.16 + level * 0.72;
  const glow = 0.08 + level * 0.16;

  return {
    background: `rgba(${accent}, ${opacity})`,
    boxShadow: `0 18px 40px rgba(${accent}, ${glow}), inset 0 0 0 1px rgba(255, 255, 255, 0.08)`,
  };
}

function formatAlertTime(value) {
  if (!value) return "Time unavailable";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function compactCopy(value, maxLength = 180) {
  if (!value) return "";
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trim()}...`;
}

function alertSeverityTone(severity) {
  const normalized = severity?.toLowerCase();

  if (normalized === "extreme") return "severity-extreme";
  if (normalized === "severe") return "severity-severe";
  if (normalized === "moderate") return "severity-moderate";
  if (normalized === "minor") return "severity-minor";
  return "severity-unknown";
}

function taskStatusTone(status) {
  if (status === "done") return "task-status-done";
  if (status === "in-progress") return "task-status-progress";
  return "task-status-next";
}

function Topbar({ route, navigate }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="topbar">
      <button
        aria-label="Open AegisStay home"
        className="brand brand-button"
        onClick={() => navigate("/")}
        type="button"
      >
        <span className="brand-mark">A</span>
        <span className="brand-copy">
          <strong>AegisStay</strong>
          <span>Hospitality crisis coordination</span>
        </span>
      </button>

      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={isMobileMenuOpen}
        type="button"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {isMobileMenuOpen ? (
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round"/>
          )}
        </svg>
      </button>

      <div className={`nav-links route-links ${isMobileMenuOpen ? "is-open" : ""}`}>
        {siteRoutes.map((item) => (
          <button
            className={route === item.path ? "route-link is-active" : "route-link"}
            aria-current={route === item.path ? "page" : undefined}
            key={item.path}
            onClick={() => {
              navigate(item.path);
              setIsMobileMenuOpen(false);
            }}
            type="button"
          >
            {item.navLabel}
          </button>
        ))}
      </div>
    </nav>
  );
}

function LiveDataPanel({ demoPropertyInfo, liveAlerts, nwsState, refreshAlerts }) {
  return (
    <article className="feed-card feed-card-contrast">
      <div className="feed-card-header">
        <div>
          <span className="capsule capsule-bright">Live NWS feed</span>
          <h3>{demoPropertyInfo.name}</h3>
        </div>
        <button className="mini-action" onClick={refreshAlerts} type="button">
          {nwsState.status === "loading" || nwsState.status === "refreshing"
            ? "Refreshing..."
            : "Refresh feed"}
        </button>
      </div>

      <div className="feed-meta-row">
        <span>{demoPropertyInfo.city}</span>
        <span>{demoPropertyInfo.pointLabel}</span>
        <span>Refreshes every 5 min</span>
      </div>

      <div className="live-summary-grid">
        <div className="summary-chip">
          <span>Feed state</span>
          <strong>
            {nwsState.status === "ready"
              ? "Connected"
              : nwsState.status === "error"
                ? "Check connection"
                : "Loading"}
          </strong>
        </div>
        <div className="summary-chip">
          <span>Active alerts</span>
          <strong>{nwsState.alerts.length}</strong>
        </div>
        <div className="summary-chip">
          <span>Last update</span>
          <strong>{formatAlertTime(nwsState.lastUpdated)}</strong>
        </div>
      </div>

      {nwsState.error ? (
        <div className="feed-state feed-state-error">
          <strong>Live feed unavailable right now.</strong>
          <p>
            {nwsState.error}. If this browser cannot reach the NWS endpoint directly, the next
            implementation step is to proxy the request through a small backend route.
          </p>
        </div>
      ) : null}

      {!nwsState.error && nwsState.status === "loading" ? (
        <div className="feed-state">
          <strong>Checking the live public alert feed.</strong>
          <p>Pulling active NWS alerts for the pilot property and preparing them for incident normalization.</p>
        </div>
      ) : null}

      {!nwsState.error && nwsState.status !== "loading" && liveAlerts.length === 0 ? (
        <div className="feed-state">
          <strong>No active alerts for this point right now.</strong>
          <p>The MVP should treat this as the hotel&apos;s standby monitoring state until a hazard arrives.</p>
        </div>
      ) : null}

      {liveAlerts.length > 0 ? (
        <div className="alert-list">
          {liveAlerts.map((alert) => (
            <article className="alert-item" key={alert.id}>
              <div className="alert-item-top">
                <span className={`severity-pill ${alertSeverityTone(alert.severity)}`}>
                  {alert.severity}
                </span>
                <span>{alert.event}</span>
              </div>
              <h4>{alert.headline}</h4>
              <p>{compactCopy(alert.instruction || alert.description)}</p>
              <div className="alert-item-meta">
                <span>{alert.areaDesc}</span>
                <span>{formatAlertTime(alert.sent)}</span>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      <p className="feed-footnote">
        Source: {nwsState.title || "NWS active alerts by point"} via{" "}
        <code>api.weather.gov/alerts/active?point=lat,lon</code>
      </p>
    </article>
  );
}

function TaskBoard({ completedTasks, inProgressTasks }) {
  return (
    <article className="task-board-card">
      <div className="feed-card-header">
        <div>
          <span className="capsule">Phase 1 task board</span>
          <h3>Implementation status inside the app</h3>
        </div>
        <div className="task-board-summary">
          <strong>{completedTasks}</strong>
          <span>done</span>
          <strong>{inProgressTasks}</strong>
          <span>in progress</span>
        </div>
      </div>

      <div className="task-list">
        {phaseOneTasks.map((task) => (
          <article className="task-item" key={task.title}>
            <div className="task-item-top">
              <h4>{task.title}</h4>
              <span className={`task-status ${taskStatusTone(task.status)}`}>{task.status}</span>
            </div>
            <p>{task.summary}</p>
            <small>{task.nextAction}</small>
          </article>
        ))}
      </div>
    </article>
  );
}

function OperationsStrip({ activeScenario, contextLabel, nwsState }) {
  const feedLabel =
    nwsState.status === "ready"
      ? `${nwsState.alerts.length} live`
      : nwsState.status === "error"
        ? "Check feed"
        : "Syncing";

  return (
    <section className="ops-strip-wrap">
      <div className="ops-strip">
        <article className="ops-pill">
          <span>Context</span>
          <strong>{contextLabel}</strong>
          <small>Current product surface</small>
        </article>
        <article className="ops-pill">
          <span>Scenario</span>
          <strong>{activeScenario.label}</strong>
          <small>{activeScenario.location}</small>
        </article>
        <article className="ops-pill">
          <span>Incident mode</span>
          <strong>{activeScenario.mode}</strong>
          <small>Response target {activeScenario.responseTime}</small>
        </article>
        <article className="ops-pill">
          <span>Alert feed</span>
          <strong>{feedLabel}</strong>
          <small>{nwsState.title || "National Weather Service"}</small>
        </article>
      </div>
    </section>
  );
}

function IncidentTimeline({ activeScenario }) {
  const timelineItems = [
    {
      time: "00:00",
      title: "Signal intake opens the incident",
      detail: activeScenario.alert,
    },
    {
      time: "00:07",
      title: "Guest guidance publishes instantly",
      detail: activeScenario.surfaces.guest.blurb,
    },
    {
      time: "00:14",
      title: "Staff playbook starts routing action",
      detail: activeScenario.route[0]?.step || "Dynamic playbook launched.",
    },
    {
      time: activeScenario.responseTime,
      title: "Shared operating picture reaches responders",
      detail: activeScenario.surfaces.responder.blurb,
    },
  ];

  return (
    <div className="timeline-grid">
      {timelineItems.map((item) => (
        <article className="timeline-card" key={`${item.time}-${item.title}`}>
          <div className="timeline-time">{item.time}</div>
          <h3>{item.title}</h3>
          <p>{item.detail}</p>
        </article>
      ))}
    </div>
  );
}

function useButtonFeedback(initialText, feedbackText = "✓ Sent", duration = 2000) {
  const [text, setText] = useState(initialText);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const trigger = () => {
    if (isSending) return;
    setIsSending(true);
    setText(feedbackText);
    setTimeout(() => {
      setText(initialText);
      setIsSending(false);
    }, duration);
  };

  return [text, trigger, isSending];
}

function GuestPhonePreview({ activeScenario }) {
  const guestView = activeScenario.surfaces.guest;
  const [primaryText, triggerPrimary, isPrimarySending] = useButtonFeedback(guestView.primary, "✓ Routing Started");
  const [secondaryText, triggerSecondary, isSecondarySending] = useButtonFeedback(guestView.secondary, "✓ Safe Status Sent");

  return (
    <article className="device-preview">
      <div className="device-shell">
        <div className="device-topline">
          <span className="device-notch" />
          <span className="device-status">Emergency card</span>
        </div>
        <div className="device-body">
          <div className="device-banner">
            <span className="capsule capsule-soft">{activeScenario.mode}</span>
            <h3>{primaryText !== guestView.primary ? "Stay put" : guestView.primary}</h3>
            <p>{compactCopy(guestView.blurb, 110)}</p>
          </div>
          <div className="device-route">
            {activeScenario.route.slice(0, 3).map((item) => (
              <div className="device-route-row" key={item.step}>
                <span className={`status-dot ${statusTone(item.status)}`} />
                <p>{item.step}</p>
              </div>
            ))}
          </div>
          <div className="device-actions">
            <button 
              className={`device-action device-action-primary ${isPrimarySending ? "is-active-feedback" : ""}`}
              disabled={isPrimarySending}
              onClick={triggerPrimary} 
              type="button"
            >
              {primaryText}
            </button>
            <button 
              className={`device-action ${isSecondarySending ? "is-active-feedback" : ""}`}
              disabled={isSecondarySending}
              onClick={triggerSecondary} 
              type="button"
            >
              {secondaryText}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ResponderBriefBoard({ activeScenario }) {
  return (
    <div className="brief-grid">
      <article className="brief-card brief-card-dark">
        <span className="capsule capsule-bright">Arrival brief</span>
        <h3>What responding crews can know before arrival</h3>
        <ul className="feature-list feature-list-dark">
          <li>Ingress points, stairwells, shutoffs, and refuge rooms</li>
          <li>Live room-status confidence and unresolved SOS markers</li>
          <li>Secure staging notes tied to the active incident mode</li>
        </ul>
      </article>
      <article className="brief-card">
        <span className="capsule">Current scenario</span>
        <h3>{activeScenario.label}</h3>
        <p>{activeScenario.surfaces.responder.blurb}</p>
        <div className="brief-chip-row">
          {activeScenario.metrics.slice(0, 3).map((metric) => (
            <span className="brief-chip" key={metric.label}>
              {metric.label}: {metric.value}
            </span>
          ))}
        </div>
      </article>
    </div>
  );
}

function SurfacePanel({ activeScenario, activeSurface, setActiveSurface }) {
  const activeSurfacePanel = activeScenario.surfaces[activeSurface];
  const [primaryText, triggerPrimary, isPrimarySending] = useButtonFeedback(activeSurfacePanel.primary, "✓ Sent");
  const [secondaryText, triggerSecondary, isSecondarySending] = useButtonFeedback(activeSurfacePanel.secondary, "✓ Updated");

  return (
    <article className="surface-card">
      <div className="surface-tabs" role="tablist" aria-label="Audience views">
        {Object.keys(activeScenario.surfaces).map((surface) => (
          <button
            key={surface}
            className={surface === activeSurface ? "surface-tab active" : "surface-tab"}
            onClick={() => setActiveSurface(surface)}
            type="button"
          >
            {surface}
          </button>
        ))}
      </div>

      <div className="surface-content">
        <span className="capsule capsule-soft">{activeSurfacePanel.title}</span>
        <h3>{activeSurfacePanel.primary}</h3>
        <p>{activeSurfacePanel.blurb}</p>

        <div className="action-row">
          <button 
             className={`button-primary ${isPrimarySending ? "is-active-feedback" : ""}`}
             disabled={isPrimarySending}
             onClick={triggerPrimary}
             type="button"
          >
            {primaryText}
          </button>
          <button 
             className={`button-secondary ${isSecondarySending ? "is-active-feedback" : ""}`}
             disabled={isSecondarySending}
             onClick={triggerSecondary}
             type="button"
          >
            {secondaryText}
          </button>
        </div>

        <ul className="feature-list">
          {activeSurfacePanel.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function PageLayout({
  activeScenario,
  route,
  navigate,
  eyebrow,
  title,
  lead,
  stats,
  contextLabel,
  nwsState,
  primaryAction,
  secondaryAction,
  children,
}) {
  return (
    <div className="site-shell">
      <header className="hero-shell page-hero-shell">
        <Topbar navigate={navigate} route={route} />

        <section className="page-hero">
          <div className="page-hero-copy">
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="hero-text page-hero-text">{lead}</p>

            <div className="cta-row">
              {primaryAction ? (
                <button className="button-primary" onClick={primaryAction.onClick} type="button">
                  {primaryAction.label}
                </button>
              ) : null}
              {secondaryAction ? (
                <button className="button-secondary" onClick={secondaryAction.onClick} type="button">
                  {secondaryAction.label}
                </button>
              ) : null}
            </div>
          </div>

          <div className="page-hero-stats">
            {stats.map((stat) => (
              <article className="metric-card page-metric-card" key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <small>{stat.caption}</small>
              </article>
            ))}
          </div>
        </section>

        <OperationsStrip
          activeScenario={activeScenario}
          contextLabel={contextLabel}
          nwsState={nwsState}
        />
      </header>

      <main>{children}</main>

      <footer className="section page-footer">
        <div className="closing-card page-footer-card">
          <p className="eyebrow">Keep exploring</p>
          <h2>Each page is designed as a product surface, not just a presentation slide.</h2>
          <div className="page-footer-links">
            {siteRoutes.map((item) => (
              <button
                className={route === item.path ? "footer-route is-active" : "footer-route"}
                key={item.path}
                onClick={() => navigate(item.path)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

function PlatformPage({
  route,
  navigate,
  activeScenario,
  liveAlerts,
  nwsState,
  refreshAlerts,
  completedTasks,
  inProgressTasks,
}) {
  return (
    <PageLayout
      activeScenario={activeScenario}
      eyebrow="Platform architecture"
      contextLabel="Shared incident model"
      lead="AegisStay acts like an incident operating system: public signals in, coordinated decisions out, with one shared record for guests, staff, and responders."
      navigate={navigate}
      nwsState={nwsState}
      primaryAction={{ label: "Open the command center", onClick: () => navigate("/command-center") }}
      route={route}
      secondaryAction={{ label: "See the live feed", onClick: () => window.scrollTo({ top: 720, behavior: "smooth" }) }}
      stats={[
        { label: "Real source live", value: "NWS", caption: "active public alerts by point" },
        { label: "Core surfaces", value: "3", caption: "guest, staff, responder" },
        { label: "MVP stance", value: "Simulator-first", caption: "credible without hardware" },
      ]}
      title="One emergency platform, split into operational pages instead of one long pitch."
    >
      <section className="section page-section">
        <div className="section-intro">
          <p className="eyebrow eyebrow-dark">Signal layer</p>
          <h2>Real signals, realistic routing, and a clean incident object.</h2>
          <p>The stack below is what makes the concept believable in the real world and adaptable across different properties.</p>
        </div>
        <div className="signal-grid">
          {signalPillars.map((pillar) => (
            <article className="signal-card" key={pillar.title}>
              <span className="signal-label">{pillar.label}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section page-section">
        <div className="section-intro">
          <p className="eyebrow eyebrow-dark">Live pipeline</p>
          <h2>The platform already has a real data foothold.</h2>
          <p>The NWS feed and the in-app task board are now separate reusable panels so future pages can share them.</p>
        </div>
        <div className="live-data-grid">
          <LiveDataPanel
            demoPropertyInfo={demoProperty}
            liveAlerts={liveAlerts}
            nwsState={nwsState}
            refreshAlerts={refreshAlerts}
          />
          <TaskBoard completedTasks={completedTasks} inProgressTasks={inProgressTasks} />
        </div>
      </section>

      <section className="section page-section">
        <div className="section-intro">
          <p className="eyebrow eyebrow-dark">Incident journey</p>
          <h2>What the first critical seconds look like in product form.</h2>
          <p>The timeline below turns the concept into a more credible operational story.</p>
        </div>
        <IncidentTimeline activeScenario={activeScenario} />
      </section>

      <section className="section page-section">
        <div className="section-intro">
          <p className="eyebrow eyebrow-dark">Operating model</p>
          <h2>Built as one incident pipeline, not a loose collection of screens.</h2>
        </div>
        <div className="architecture-track">
          {implementationPhases.map((phase) => (
            <article className="phase-card" key={phase.name}>
              <span className="phase-index">{phase.name}</span>
              <p>{phase.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}

function GuestAppPage({
  route,
  navigate,
  activeScenario,
  activeScenarioId,
  setActiveScenarioId,
  nwsState,
}) {
  return (
    <PageLayout
      activeScenario={activeScenario}
      eyebrow="Guest mobile experience"
      contextLabel="Guest touchpoint"
      lead="This is the calm, multilingual, hotel-grade emergency surface that guests actually see when something goes wrong."
      navigate={navigate}
      nwsState={nwsState}
      primaryAction={{ label: "Open responder view", onClick: () => navigate("/responders") }}
      route={route}
      secondaryAction={{ label: "Back to overview", onClick: () => navigate("/") }}
      stats={[
        { label: "Primary outcome", value: "Less panic", caption: "clear instructions in context" },
        { label: "Key action", value: "Mark safe", caption: "one-tap accountability" },
        { label: "Roadmap", value: "Offline-ready", caption: "mesh and cached guidance" },
      ]}
      title="Replace the static evacuation card with a live guest companion."
    >
      <section className="section page-section">
        <div className="section-intro">
          <p className="eyebrow eyebrow-dark">Scenario-aware guest flow</p>
          <h2>The guest experience changes with the incident, not with a hardcoded brochure.</h2>
        </div>
        <ScenarioSelector
          activeScenarioId={activeScenarioId}
          scenarios={scenarios}
          setActiveScenarioId={setActiveScenarioId}
        />
        <div className="page-two-column">
          <article className="ops-card">
            <div className="ops-header">
              <div>
                <span className="capsule">Guest journey</span>
                <h3>{activeScenario.surfaces.guest.primary}</h3>
              </div>
              <div className="mode-token">{activeScenario.mode}</div>
            </div>
            <p className="ops-summary">{activeScenario.surfaces.guest.blurb}</p>
            <ul className="feature-list">
              {activeScenario.surfaces.guest.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </article>

          <GuestPhonePreview activeScenario={activeScenario} />
        </div>
      </section>

      <section className="section page-section">
        <div className="section-intro">
          <p className="eyebrow eyebrow-dark">Guest journey timeline</p>
          <h2>From alert to reassurance in a few compact steps.</h2>
        </div>
        <IncidentTimeline activeScenario={activeScenario} />
      </section>

      <section className="section page-section">
        <div className="section-intro">
          <p className="eyebrow eyebrow-dark">Idea expansion</p>
          <h2>More product depth for the guest app.</h2>
        </div>
        <div className="capability-grid">
          {guestExperienceIdeas.map((item) => (
            <article className="capability-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}

function CommandCenterPage({
  route,
  navigate,
  activeScenario,
  activeScenarioId,
  liveAlerts,
  setActiveScenarioId,
  nwsState,
}) {
  return (
    <PageLayout
      activeScenario={activeScenario}
      eyebrow="Staff command center"
      contextLabel="Operational control"
      lead="The command center is where occupancy confidence, incident playbooks, and field accountability come together under pressure."
      navigate={navigate}
      nwsState={nwsState}
      primaryAction={{ label: "View guest app", onClick: () => navigate("/guest-app") }}
      route={route}
      secondaryAction={{ label: "See responders", onClick: () => navigate("/responders") }}
      stats={[
        { label: "Visibility", value: "Floor-aware", caption: "heatmaps and route changes" },
        { label: "Modes", value: "3", caption: "evacuate, shelter, lockdown" },
        { label: "Drill ready", value: "Yes", caption: "simulator-backed demos" },
      ]}
      title="Give hotel staff a calm control room instead of a scramble."
    >
      <CommandCenterDashboard
        activeScenario={activeScenario}
        activeScenarioId={activeScenarioId}
        demoProperty={demoProperty}
        heatCellStyle={heatCellStyle}
        liveAlerts={liveAlerts}
        scenarios={scenarios}
        setActiveScenarioId={setActiveScenarioId}
        statusTone={statusTone}
      />

      <section className="section page-section">
        <div className="section-intro">
          <p className="eyebrow eyebrow-dark">Core command modules</p>
          <h2>What makes the staff side operationally useful.</h2>
        </div>
        <div className="capability-grid">
          {commandCenterModules.map((item) => (
            <article className="capability-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section page-section">
        <div className="section-intro">
          <p className="eyebrow eyebrow-dark">Operational modes</p>
          <h2>Three distinct system behaviors the UI should make obvious.</h2>
        </div>
        <div className="capability-grid">
          {commandModes.map((item) => (
            <article className="capability-card capability-card-accent" key={item.title}>
              <span className="signal-label">{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}

function RespondersPage({
  route,
  navigate,
  activeScenario,
  activeSurface,
  setActiveSurface,
  nwsState,
}) {
  return (
    <PageLayout
      activeScenario={activeScenario}
      eyebrow="Responder handoff"
      contextLabel="Field coordination"
      lead="The responder link is the bridge between hotel operations and incoming emergency crews before they even arrive on scene."
      navigate={navigate}
      nwsState={nwsState}
      primaryAction={{ label: "Open platform page", onClick: () => navigate("/platform") }}
      route={route}
      secondaryAction={{ label: "Back to command center", onClick: () => navigate("/command-center") }}
      stats={[
        { label: "Access model", value: "Expiring link", caption: "no hotel login required" },
        { label: "Briefing payload", value: "Floor pack", caption: "hazards, shutoffs, statuses" },
        { label: "Design goal", value: "Faster arrival", caption: "better situational awareness" },
      ]}
      title="Create a digital Knox Box that is actually useful in the first minute."
    >
      <section className="section page-section">
        <div className="section-intro">
          <p className="eyebrow eyebrow-dark">Responder surface</p>
          <h2>Preview the same incident through the responder lens.</h2>
        </div>
        <SurfacePanel
          activeScenario={activeScenario}
          activeSurface={activeSurface}
          setActiveSurface={setActiveSurface}
        />
      </section>

      <section className="section page-section">
        <div className="section-intro">
          <p className="eyebrow eyebrow-dark">Pre-arrival view</p>
          <h2>The responder page should feel like a fast tactical briefing, not a PDF export.</h2>
        </div>
        <ResponderBriefBoard activeScenario={activeScenario} />
      </section>

      <section className="section page-section">
        <div className="section-intro">
          <p className="eyebrow eyebrow-dark">Arrival brief</p>
          <h2>The responder handoff can grow beyond a PDF.</h2>
        </div>
        <div className="capability-grid">
          {responderModules.map((item) => (
            <article className="capability-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}

export default function App() {
  const [route, setRoute] = useState(() => getRouteFromHash(window.location.hash));
  const [activeScenarioId, setActiveScenarioId] = useState(scenarios[0].id);
  const [activeSurface, setActiveSurface] = useState("staff");
  const [nwsRefreshKey, setNwsRefreshKey] = useState(0);
  const [nwsState, setNwsState] = useState({
    status: "loading",
    alerts: [],
    error: "",
    lastUpdated: "",
    title: "",
  });

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    async function loadAlerts() {
      setNwsState((current) => ({
        ...current,
        status: current.lastUpdated ? "refreshing" : "loading",
        error: "",
      }));

      try {
        const result = await fetchActiveAlertsByPoint(
          demoProperty.coordinates.lat,
          demoProperty.coordinates.lon,
          controller.signal,
        );

        if (ignore) return;

        setNwsState({
          status: "ready",
          alerts: result.alerts,
          error: "",
          lastUpdated: new Date().toISOString(),
          title: result.title,
        });
      } catch (error) {
        if (ignore || controller.signal.aborted) return;

        setNwsState((current) => ({
          ...current,
          status: "error",
          error:
            error instanceof Error
              ? error.message
              : "Unable to load live weather alerts right now.",
        }));
      }
    }

    loadAlerts();

    const intervalId = window.setInterval(() => {
      setNwsRefreshKey((current) => current + 1);
    }, NWS_REFRESH_INTERVAL_MS);

    return () => {
      ignore = true;
      controller.abort();
      window.clearInterval(intervalId);
    };
  }, [nwsRefreshKey]);

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = "/";
    }

    function syncRoute() {
      const nextRoute = getRouteFromHash(window.location.hash);

      if (window.location.hash !== `#${nextRoute}`) {
        window.location.hash = nextRoute;
        return;
      }

      setRoute(nextRoute);
    }

    window.addEventListener("hashchange", syncRoute);
    syncRoute();

    return () => {
      window.removeEventListener("hashchange", syncRoute);
    };
  }, []);

  useEffect(() => {
    if (route === "/guest-app") setActiveSurface("guest");
    if (route === "/command-center") setActiveSurface("staff");
    if (route === "/responders") setActiveSurface("responder");
  }, [route]);

  const activeScenario =
    scenarios.find((scenario) => scenario.id === activeScenarioId) ?? scenarios[0];
  const activeSurfacePanel = activeScenario.surfaces[activeSurface];
  const liveAlerts = nwsState.alerts.slice(0, 3);
  const completedTasks = phaseOneTasks.filter((task) => task.status === "done").length;
  const inProgressTasks = phaseOneTasks.filter(
    (task) => task.status === "in-progress",
  ).length;
  const refreshAlerts = () => setNwsRefreshKey((current) => current + 1);
  const navigate = (path) => {
    const nextHash = `#${path}`;

    if (window.location.hash !== nextHash) {
      window.location.hash = path;
    } else {
      setRoute(path);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (route === "/platform") {
    return (
      <PlatformPage
        activeScenario={activeScenario}
        completedTasks={completedTasks}
        inProgressTasks={inProgressTasks}
        liveAlerts={liveAlerts}
        navigate={navigate}
        nwsState={nwsState}
        refreshAlerts={refreshAlerts}
        route={route}
      />
    );
  }

  if (route === "/guest-app") {
    return (
      <GuestAppPage
        activeScenario={activeScenario}
        activeScenarioId={activeScenarioId}
        navigate={navigate}
        nwsState={nwsState}
        route={route}
        setActiveScenarioId={setActiveScenarioId}
      />
    );
  }

  if (route === "/command-center") {
    return (
      <CommandCenterPage
        activeScenario={activeScenario}
        activeScenarioId={activeScenarioId}
        liveAlerts={liveAlerts}
        navigate={navigate}
        nwsState={nwsState}
        route={route}
        setActiveScenarioId={setActiveScenarioId}
      />
    );
  }

  if (route === "/responders") {
    return (
      <RespondersPage
        activeScenario={activeScenario}
        activeSurface={activeSurface}
        navigate={navigate}
        nwsState={nwsState}
        route={route}
        setActiveSurface={setActiveSurface}
      />
    );
  }

  return (
    <div className="site-shell">
      <header className="hero-shell">
        <Topbar navigate={navigate} route={route} />

        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="eyebrow">Accelerated Emergency Response in Hospitality</p>
            <h1>Hotels do not need another alarm. They need a live coordination layer.</h1>
            <p className="hero-text">
              AegisStay is a React-powered product concept that turns public hazard signals,
              indoor routing, and guest accountability into one modern operating system for
              hotels under pressure.
            </p>

            <div className="cta-row">
              <button className="button-primary" onClick={() => navigate("/command-center")} type="button">
                Open the command center
              </button>
              <button className="button-secondary" onClick={() => navigate("/platform")} type="button">
                View platform pages
              </button>
            </div>

            <div className="hero-metrics">
              <div className="metric-card">
                <span>Incident created</span>
                <strong>{activeScenario.responseTime}</strong>
                <small>from alert to action</small>
              </div>
              <div className="metric-card">
                <span>Guest reach</span>
                <strong>5 languages</strong>
                <small>calm multilingual delivery</small>
              </div>
              <div className="metric-card">
                <span>Responder handoff</span>
                <strong>1 secure link</strong>
                <small>floor plans, hazards, live status</small>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="dashboard-frame">
              <div className="frame-topline">
                <span className="live-pill">Live incident</span>
                <span>{activeScenario.location}</span>
              </div>

              <div className="dashboard-banner">
                <div>
                  <p>{activeScenario.kicker}</p>
                  <h2>{activeScenario.label}</h2>
                </div>
                <div className="alert-badge">{activeScenario.mode}</div>
              </div>

              <div className="dashboard-grid">
                <div className="panel panel-wide">
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
                </div>

                <div className="panel">
                  <div className="panel-heading">
                    <span>Trigger</span>
                    <strong>{activeScenario.alert}</strong>
                  </div>
                  <p className="panel-copy">
                    The platform normalizes the signal, opens an incident, and launches the
                    recommended workflow automatically.
                  </p>
                </div>

                <div className="panel">
                  <div className="panel-heading">
                    <span>Responder brief</span>
                    <strong>Expiring secure access</strong>
                  </div>
                  <ul className="micro-list">
                    <li>3D floor pack</li>
                    <li>Hazard and shutoff locations</li>
                    <li>Live safe and SOS statuses</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </header>

      <main>
        <OperationsStrip
          activeScenario={activeScenario}
          contextLabel="Product overview"
          nwsState={nwsState}
        />

        <section className="section page-directory-section">
          <div className="section-intro">
            <p className="eyebrow eyebrow-dark">Explore the product</p>
            <h2>The single-page concept is now a navigable product site.</h2>
            <p>
              Move through dedicated pages for the platform, guest app, command center,
              and responder handoff without leaving the same React app.
            </p>
          </div>

          <div className="page-card-grid">
            {pageCards.map((card) => (
              <button
                className="page-card"
                key={card.path}
                onClick={() => navigate(card.path)}
                type="button"
              >
                <span className="capsule capsule-soft">{card.path === "/" ? "Home" : "Page"}</span>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="section story-section">
          <div className="story-grid">
            <div className="story-column">
              <div className="section-intro">
                <p className="eyebrow eyebrow-dark">Operational story</p>
                <h2>Show judges the timeline, not just the promise.</h2>
                <p>
                  A modern emergency platform should make the first minute feel legible. This
                  section turns the concept into a lived sequence of actions across guests,
                  staff, and responders.
                </p>
              </div>
              <IncidentTimeline activeScenario={activeScenario} />
            </div>

            <div className="story-column">
              <div className="section-intro">
                <p className="eyebrow eyebrow-dark">Mode logic</p>
                <h2>Three operational personalities, one interface language.</h2>
              </div>
              <div className="mode-card-stack">
                {commandModes.map((item) => (
                  <article className="mode-card" key={item.title}>
                    <span className="signal-label">{item.label}</span>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section signal-section" id="signals">
          <div className="section-intro">
            <p className="eyebrow eyebrow-dark">Grounded in real signals</p>
            <h2>The story is ambitious. The data stack is real-world.</h2>
            <p>
              This site is framed like a product launch, but its signal model maps to live
              public APIs, historical resilience datasets, and indoor routing engines that can
              support a credible hackathon demo.
            </p>
          </div>

          <div className="signal-grid">
            {signalPillars.map((pillar) => (
              <article className="signal-card" key={pillar.title}>
                <span className="signal-label">{pillar.label}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section live-data-section" id="live-data">
          <div className="section-intro">
            <p className="eyebrow eyebrow-dark">Phase 1 now underway</p>
            <h2>One real data source is wired in: live NWS alerts for a demo hotel point.</h2>
            <p>
              The app now reaches out to the National Weather Service active-alert endpoint
              for a U.S. pilot property. That gives the prototype a real hazard intake layer
              while the rest of the platform remains simulator-first.
            </p>
          </div>

          <div className="live-data-grid">
            <LiveDataPanel
              demoPropertyInfo={demoProperty}
              liveAlerts={liveAlerts}
              nwsState={nwsState}
              refreshAlerts={refreshAlerts}
            />

            <TaskBoard completedTasks={completedTasks} inProgressTasks={inProgressTasks} />
          </div>
        </section>

        <section className="section simulator-section" id="simulator">
          <div className="section-intro">
            <p className="eyebrow eyebrow-dark">Interactive product simulator</p>
            <h2>Switch the emergency scenario and see the platform adapt.</h2>
            <p>
              The demo is designed to show a judge or stakeholder what changes for guests,
              staff, and responders when the incident type changes, without rebuilding the
              product each time.
            </p>
          </div>

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

          <div className="simulator-grid">
            <article className="ops-card">
              <div className="ops-header">
                <div>
                  <span className="capsule">Incident mode</span>
                  <h3>{activeScenario.title}</h3>
                </div>
                <div className="mode-token">{activeScenario.mode}</div>
              </div>

              <p className="ops-summary">{activeScenario.summary}</p>

              <div className="stats-grid">
                {activeScenario.metrics.map((metric) => (
                  <div className="stat-box" key={metric.label}>
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                  </div>
                ))}
              </div>

              <div className="route-panel">
                <div className="panel-heading">
                  <span>Priority actions</span>
                  <strong>Dynamic playbook</strong>
                </div>
                <div className="route-list">
                  {activeScenario.route.map((item) => (
                    <div className="route-item" key={item.step}>
                      <span className={`status-dot ${statusTone(item.status)}`} />
                      <p>{item.step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <SurfacePanel
              activeScenario={activeScenario}
              activeSurface={activeSurface}
              setActiveSurface={setActiveSurface}
            />
          </div>
        </section>

        <section className="section capabilities-section">
          <div className="section-intro">
            <p className="eyebrow eyebrow-dark">Why it feels real</p>
            <h2>Modern product design paired with operational credibility.</h2>
          </div>

          <div className="capability-grid">
            {capabilities.map((capability) => (
              <article className="capability-card" key={capability.title}>
                <h3>{capability.title}</h3>
                <p>{capability.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section adapt-section" id="adapt">
          <div className="section-intro">
            <p className="eyebrow eyebrow-dark">Deployment flexibility</p>
            <h2>Adapt the platform for different properties and operating models.</h2>
            <p>
              The concept is structured so teams can localize scenarios, tune workflows, and
              expand the data layer without rebuilding the core incident experience from scratch.
            </p>
          </div>

          <div className="adapt-grid">
            {adaptationCards.map((card) => (
              <article className="adapt-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section architecture-section" id="architecture">
          <div className="section-intro">
            <p className="eyebrow eyebrow-dark">System design</p>
            <h2>Built as one incident pipeline, not a loose collection of screens.</h2>
            <p>
              The strongest implementation path is a React front end on top of a real-time
              incident model, with alert ingestion, routing data, and simulator inputs feeding
              the same command layer.
            </p>
          </div>

          <div className="architecture-track">
            {implementationPhases.map((phase) => (
              <article className="phase-card" key={phase.name}>
                <span className="phase-index">{phase.name}</span>
                <p>{phase.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section roadmap-section" id="launch">
          <div className="launch-grid">
            <article className="launch-card">
              <p className="eyebrow eyebrow-dark">Launch-ready MVP</p>
              <h2>What to build first over a hackathon weekend</h2>
              <ol className="launch-list">
                <li>Stand up a React front end with staff, guest, and responder views.</li>
                <li>Use one property and one indoor floor-plan model for the core demo.</li>
                <li>Ingest live alerts and push them into a shared incident timeline.</li>
                <li>Simulate occupancy, SOS, and assembly check-in updates in real time.</li>
              </ol>
            </article>

            <article className="launch-card launch-card-contrast">
              <p className="eyebrow">Future roadmap</p>
              <h2>High-impact features to pitch next</h2>
              <div className="roadmap-cloud">
                {roadmap.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="section closing-section" id="contact">
          <div className="closing-card">
            <p className="eyebrow">From alert to accountability</p>
            <h2>Designed to help a hotel respond with the calm of a control room.</h2>
            <p>
              The site is ready to evolve into a real product MVP with Supabase, live alert
              ingestion, indoor routing data, and production-grade messaging flows.
            </p>
            <div className="cta-row">
              <button className="button-primary" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} type="button">
                Back to top
              </button>
              <button className="button-secondary" onClick={() => navigate("/platform")} type="button">
                Review platform architecture
              </button>
            </div>
          </div>
          <div className="page-footer-links" style={{ justifyContent: "center", marginTop: "40px" }}>
            <span style={{ color: "var(--text-soft)", fontSize: "0.85rem" }}>
              Simulation Environment MVP • © {new Date().getFullYear()} AegisStay
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
