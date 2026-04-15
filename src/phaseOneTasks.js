export const phaseOneTasks = [
  {
    title: "Vite React prototype foundation",
    status: "done",
    summary:
      "The product shell, interactive simulator, and audience-specific demo views are already in place inside the app.",
    nextAction: "Keep this as the presentation layer while real integrations are added behind it.",
  },
  {
    title: "National Weather Service live trigger",
    status: "in-progress",
    summary:
      "The app now fetches active alerts for a fixed hotel point using the NWS alerts API and surfaces the live result in the UI.",
    nextAction:
      "Next: normalize relevant alerts into incident records and persist them through a backend.",
  },
  {
    title: "OpenFEMA resilience context",
    status: "done",
    summary:
      "Add disaster declarations and mitigation history for the pilot region so staff can see preparedness context, not only current hazards.",
    nextAction:
      "Choose one geographic slice first and cache a small curated response for the demo.",
  },
  {
    title: "Indoor routing provider selection",
    status: "next",
    summary:
      "Pick one floor-aware mapping provider and attach a single demo property map so evacuation and refuge routes can become data-driven.",
    nextAction:
      "Prefer one provider, one floor plan, and one route scenario over a broad mapping abstraction.",
  },
  {
    title: "Dispatch realism overlay",
    status: "next",
    summary:
      "Bring in one public dispatch or station dataset to make responder ETA and staging views feel grounded in real city operations.",
    nextAction:
      "Start with one city dataset only and use it to enrich the responder panel, not to rebuild dispatch.",
  },
];
