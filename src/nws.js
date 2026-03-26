export const demoProperty = {
  name: "Miami Beach Pilot Property",
  city: "Miami Beach, Florida, USA",
  coordinates: {
    lat: 25.7907,
    lon: -80.1300,
  },
  pointLabel: "25.7907, -80.1300",
};

function normalizeAlert(feature) {
  const properties = feature?.properties ?? {};
  const fallbackId = `${properties.event ?? "alert"}-${properties.sent ?? properties.effective ?? "now"}`;

  return {
    id: feature?.id ?? properties.id ?? properties["@id"] ?? fallbackId,
    areaDesc: properties.areaDesc ?? "Area unavailable",
    certainty: properties.certainty ?? "Unknown",
    description: properties.description ?? "",
    ends: properties.ends ?? "",
    event: properties.event ?? "Untitled alert",
    headline: properties.headline ?? properties.event ?? "Untitled alert",
    instruction: properties.instruction ?? "",
    response: properties.response ?? "Unknown",
    sent: properties.sent ?? properties.effective ?? "",
    severity: properties.severity ?? "Unknown",
    url: feature?.id ?? properties["@id"] ?? properties.id ?? "",
    urgency: properties.urgency ?? "Unknown",
  };
}

export async function fetchActiveAlertsByPoint(lat, lon, signal) {
  const point = `${Number(lat).toFixed(4)},${Number(lon).toFixed(4)}`;
  const response = await fetch(`https://api.weather.gov/alerts/active?point=${point}`, {
    headers: {
      Accept: "application/geo+json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`NWS returned HTTP ${response.status}`);
  }

  const data = await response.json();
  const features = Array.isArray(data.features) ? data.features : [];

  return {
    title: data.title ?? "NWS active alerts",
    point,
    alerts: features.map(normalizeAlert),
  };
}
