export const commandDashboardSections = [
  { id: "overview", label: "Overview", note: "System status and posture" },
  { id: "occupancy", label: "Occupancy", note: "Heatmap and sweep confidence" },
  { id: "playbooks", label: "Playbooks", note: "Dynamic action queue" },
  { id: "accountability", label: "Accountability", note: "Safe, SOS, muster" },
  { id: "responders", label: "Responders", note: "Field handoff and brief" },
  { id: "systems", label: "Systems", note: "Locks, lights, comms" },
];

export function getCommandSectionContent(activeScenario) {
  return {
    overview: {
      title: "Incident overview",
      body:
        "Leadership sees the whole operating picture here, from signal intake to guest communication and responder readiness.",
      focus: [
        {
          label: "Trigger",
          value: activeScenario.kicker,
          detail: activeScenario.alert,
        },
        {
          label: "Property",
          value: activeScenario.location,
          detail: "Current hotel context and active venue footprint",
        },
        {
          label: "Mode",
          value: activeScenario.mode,
          detail: `Command response target ${activeScenario.responseTime}`,
        },
      ],
    },
    occupancy: {
      title: "Occupancy and sweep confidence",
      body:
        "Blend PMS occupancy, Wi-Fi presence, and sweep confirmations into one confidence model instead of trusting a single system.",
      focus: [
        {
          label: activeScenario.metrics[0]?.label || "Guests in-house",
          value: activeScenario.metrics[0]?.value || "214",
          detail: "Primary in-building count feeding the room model",
        },
        {
          label: activeScenario.metrics[1]?.label || "Acknowledged",
          value: activeScenario.metrics[1]?.value || "79%",
          detail: "People who have actively responded to guidance",
        },
        {
          label: "Sweep focus",
          value: activeScenario.heatmap[0]?.floor || "L8",
          detail: "Highest-priority floor for wardens and mobility support",
        },
      ],
    },
    playbooks: {
      title: "Dynamic playbook controls",
      body:
        "Recommended actions should shift with the incident type, preserving calm while making it obvious what staff do next.",
      focus: activeScenario.route.slice(0, 3).map((item, index) => ({
        label: `Priority ${index + 1}`,
        value: item.step,
        detail: `Status: ${item.status}`,
      })),
    },
    accountability: {
      title: "Guest accountability",
      body:
        "The dashboard should reconcile safe confirmations, SOS requests, and assembly updates into one accountability board.",
      focus: [
        {
          label: "Safe status",
          value: activeScenario.metrics[1]?.value || "79%",
          detail: "Acknowledgements, safe taps, and roster reconciliations",
        },
        {
          label: "Support queue",
          value: activeScenario.metrics[2]?.value || "3",
          detail: "Unresolved assistance or SOS items still open",
        },
        {
          label: "Next checkpoint",
          value: activeScenario.responseTime,
          detail: "Target time for first credible accountability picture",
        },
      ],
    },
    responders: {
      title: "Responder handoff",
      body:
        "Incoming crews need the shortest path to building context, hazards, ingress, and live room confidence before they arrive.",
      focus: [
        {
          label: "Brief access",
          value: activeScenario.surfaces.responder.primary,
          detail: "Expiring link with floor-aware context",
        },
        {
          label: activeScenario.metrics[3]?.label || "Responder ETA",
          value: activeScenario.metrics[3]?.value || "6 min",
          detail: "Estimated arrival window used for staging decisions",
        },
        {
          label: "Sensitive scope",
          value: "Selective",
          detail: "Only mission-critical data is shared during high-risk events",
        },
      ],
    },
    systems: {
      title: "Building systems and overrides",
      body:
        "When hardware is available, the command surface should orchestrate doors, lights, signage, and message presets from one panel.",
      focus: [
        {
          label: "Door logic",
          value:
            activeScenario.mode === "Lockdown" ? "Controlled access" : "Exit-first unlocks",
          detail: "Electronic access posture tied to incident mode",
        },
        {
          label: "Lighting",
          value:
            activeScenario.mode === "Partial evacuation"
              ? "Path guidance active"
              : "Standby scenes",
          detail: "Emergency LED and corridor cues prepared for the current event",
        },
        {
          label: "Comms",
          value: "Broadcast templates",
          detail: "Guest, staff, and responder messages stay aligned",
        },
      ],
    },
  };
}

export function getSystemControls(activeScenario) {
  if (activeScenario.mode === "Lockdown") {
    return [
      "Restrict west lobby and staff access doors",
      "Push silent guest instructions",
      "Share tactical responder brief only",
      "Hold nonessential public announcements",
    ];
  }

  if (activeScenario.mode === "Partial evacuation") {
    return [
      "Unlock emergency exits on affected levels",
      "Turn on corridor path lighting",
      "Pause guest elevator usage",
      "Open assembly roster check-in flow",
    ];
  }

  return [
    "Designate refuge zones and shelter rooms",
    "Pause unnecessary movement between floors",
    "Broadcast indoor safety instructions",
    "Reserve responder ingress lanes",
  ];
}
