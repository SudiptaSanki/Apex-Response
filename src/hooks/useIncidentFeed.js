import { useEffect, useState } from "react";

const STORAGE_KEY = "aegisstay_incident_store_v1";

function loadIncidentStore() {
  if (typeof window === "undefined") {
    return { incidents: {} };
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return { incidents: {} };
    }

    const parsed = JSON.parse(rawValue);
    return parsed?.incidents ? parsed : { incidents: {} };
  } catch {
    return { incidents: {} };
  }
}

function saveIncidentStore(store) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function slugify(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function createIncidentId(property, activeScenario) {
  return `${slugify(property.name)}-${activeScenario.id}`;
}

function buildIncidentMeta(activeScenario, property) {
  return {
    id: createIncidentId(property, activeScenario),
    location: activeScenario.location,
    mode: activeScenario.mode,
    propertyName: property.name,
    propertyPoint: property.pointLabel,
    scenarioId: activeScenario.id,
    scenarioLabel: activeScenario.label,
  };
}

function createIncidentRecord(meta) {
  return {
    ...meta,
    createdAt: new Date().toISOString(),
    updatedAt: "",
    events: [],
  };
}

function sortByOccurredAtDesc(left, right) {
  return new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime();
}

function sortByOccurredAtAsc(left, right) {
  return new Date(left.occurredAt).getTime() - new Date(right.occurredAt).getTime();
}

function appendEventToStore(store, meta, eventInput) {
  const incident = store.incidents[meta.id] ?? createIncidentRecord(meta);
  const currentEvents = Array.isArray(incident.events) ? incident.events : [];

  if (
    eventInput.dedupeKey &&
    currentEvents.some((event) => event.dedupeKey === eventInput.dedupeKey)
  ) {
    return {
      ...store,
      incidents: {
        ...store.incidents,
        [meta.id]: {
          ...incident,
          ...meta,
        },
      },
    };
  }

  const nextEvent = {
    id:
      eventInput.id ??
      `${meta.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    actor: eventInput.actor,
    dedupeKey: eventInput.dedupeKey ?? "",
    kind: eventInput.kind ?? "staff",
    message: eventInput.message,
    occurredAt: eventInput.occurredAt ?? new Date().toISOString(),
    showInTimeline: eventInput.showInTimeline ?? true,
    sourceLabel: eventInput.sourceLabel ?? "AegisStay command center",
    sourceUrl: eventInput.sourceUrl ?? "#/command-center",
    title: eventInput.title ?? eventInput.actor,
  };

  const nextEvents = [...currentEvents, nextEvent].sort(sortByOccurredAtDesc).slice(0, 30);

  return {
    ...store,
    incidents: {
      ...store.incidents,
      [meta.id]: {
        ...incident,
        ...meta,
        events: nextEvents,
        updatedAt: nextEvent.occurredAt,
      },
    },
  };
}

function ensureIncident(store, meta) {
  const incident = store.incidents[meta.id];

  if (!incident) {
    return {
      ...store,
      incidents: {
        ...store.incidents,
        [meta.id]: createIncidentRecord(meta),
      },
    };
  }

  return {
    ...store,
    incidents: {
      ...store.incidents,
      [meta.id]: {
        ...incident,
        ...meta,
      },
    },
  };
}

function getAlertSourceUrl(alert, property) {
  if (alert.url) {
    return alert.url;
  }

  return `https://api.weather.gov/alerts/active?point=${encodeURIComponent(property.pointLabel)}`;
}

export function useIncidentFeed({ activeScenario, liveAlerts, property }) {
  const [store, setStore] = useState(loadIncidentStore);
  const incidentMeta = buildIncidentMeta(activeScenario, property);

  useEffect(() => {
    saveIncidentStore(store);
  }, [store]);

  useEffect(() => {
    setStore((currentStore) => ensureIncident(currentStore, incidentMeta));
  }, [incidentMeta.id, incidentMeta.location, incidentMeta.mode, incidentMeta.scenarioLabel]);

  useEffect(() => {
    setStore((currentStore) =>
      appendEventToStore(currentStore, incidentMeta, {
        actor: "Incident opened",
        dedupeKey: `opened:${incidentMeta.id}`,
        kind: "signal",
        message: `${activeScenario.mode} initiated for ${activeScenario.location}.`,
        occurredAt: new Date().toISOString(),
        showInTimeline: true,
        sourceLabel: "Scenario simulator",
        sourceUrl: "#/command-center",
        title: `${activeScenario.label} incident created`,
      }),
    );

    setStore((currentStore) =>
      appendEventToStore(currentStore, incidentMeta, {
        actor: "Playbook armed",
        dedupeKey: `playbook:${incidentMeta.id}:${activeScenario.route[0]?.step ?? "default"}`,
        kind: "staff",
        message: activeScenario.route[0]?.step ?? "Dynamic playbook ready.",
        occurredAt: new Date().toISOString(),
        showInTimeline: true,
        sourceLabel: "Command playbook",
        sourceUrl: "#/platform",
        title: "Primary command action ready",
      }),
    );
  }, [incidentMeta.id, activeScenario.id, activeScenario.location, activeScenario.mode]);

  useEffect(() => {
    if (activeScenario.id !== "storm" || !liveAlerts.length) {
      return;
    }

    setStore((currentStore) => {
      let nextStore = currentStore;

      liveAlerts.forEach((alert) => {
        nextStore = appendEventToStore(nextStore, incidentMeta, {
          actor: "NWS alert ingested",
          dedupeKey: `alert:${incidentMeta.id}:${alert.id}`,
          kind: "signal",
          message: alert.headline || alert.description || alert.event,
          occurredAt: alert.sent || new Date().toISOString(),
          showInTimeline: true,
          sourceLabel: "National Weather Service alert",
          sourceUrl: getAlertSourceUrl(alert, property),
          title: alert.event,
        });
      });

      return nextStore;
    });
  }, [activeScenario.id, incidentMeta.id, liveAlerts, property]);

  const incident = store.incidents[incidentMeta.id] ?? createIncidentRecord(incidentMeta);
  const timelineItems = [...incident.events]
    .filter((event) => event.showInTimeline)
    .sort(sortByOccurredAtAsc)
    .slice(-6);
  const activityItems = [...incident.events].sort(sortByOccurredAtDesc).slice(0, 10);

  function logEvent(eventInput) {
    setStore((currentStore) => appendEventToStore(currentStore, incidentMeta, eventInput));
  }

  return {
    activityItems,
    incident,
    logEvent,
    timelineItems,
  };
}
