# Apex Response / AegisStay
**Accelerated Emergency Response and Crisis Coordination in Hospitality**

This repository contains the hardened, presentation-ready Frontend UI for the AegisStay hackathon project. It is ready for the backend team to hook up real-time databases and data pipelines.

## 🚀 How This Tool Helps Others
AegisStay solves a critical problem in the hospitality industry: **fragmented communication during crises**.
1. **Intelligent Guest Guidance**: Instead of relying on a static paper map, guests receive real-time, multilingual instructions directly on their phones. The system dynamically routes guests *away* from expanding hazards (like a spreading fire).
2. **Unified Command View for Staff**: Hotel management gets a single, live operating picture showing precisely which rooms have acknowledged safety instructions and which areas require manual sweep teams.
3. **Seamless First Responder Handoff**: Incoming emergency crews receive a "digital Knox Box"—a secure link that gives responders instant access to critical intel such as stairwell access paths, utility shutoffs, and live guest locations *before* they arrive.

---

## 📂 File Structure 
To help you navigate the frontend codebase quickly, here is the architecture:
```text
src/
├── App.jsx                # Main application, routes, layout, and top-level state
├── main.jsx               # React DOM entry point
├── styles.css             # Unified application styles (variables, grids, layout)
├── nws.js                 # Integrates with the National Weather Service active alerts API
├── phaseOneTasks.js       # Hardcoded task sequence (used in command center timeline)
├── components/            # Extracted UI sections (e.g. Navigation, Panels)
├── data/                  # Mocked scenario payloads (JSON objects for Fire, Storm, etc.)
└── hooks/                 
    └── useIncidentFeed.js # Simulated feed state (currently using localStorage for persistance)
```

## 🛠️ Backend Integration Guide (Next Steps)
The UI currently relies on mocked client-side state or public REST APIs. To "make it real", the backend team should focus on replacing these three pillars:

### 1. Central Incident State (Supabase / DB)
*   **Current State:** `App.jsx` handles state via simple React `useState` hooks, and actions trigger local simulated updates.
*   **Backend Task:** Create an `incidents` and `rooms` table in your database. Store `status`, `floor_heatmaps`, `active_routes`, and `open_tasks`. Use WebSockets (like Supabase Realtime or Socket.io) to subscribe to database changes so the frontend UI (like the Heatmap or Command Center feed) updates instantly across all connected screens.

### 2. Live Threat Data Layer (NWS / Alerts)
*   **Current State:** `src/nws.js` calls the `api.weather.gov` REST endpoint directly from the browser.
*   **Backend Task:** Move the NWS/Hazard API polling to a backend cron job or webhook wrapper. This avoids browser CORS policies, prevents IP rate-limiting, and allows the backend to trigger an automated "Alert Payload" to the frontend when a severe event strikes the hotel's GPS coordinates.

### 3. Guest Accountability & Actions
*   **Current State:** Clicking the "Mark Safe" button on the guest phone preview toggles a temporary React UI hook.
*   **Backend Task:** Create an endpoint for guest acknowledgement (`POST /api/check-in`). When a guest clicks "Mark Safe" or "Send SOS", the backend should update the specific room's status in the database. This should automatically propagate to the staff Heatmap and add a log entry into the timeline rail on the Command Center interface.
