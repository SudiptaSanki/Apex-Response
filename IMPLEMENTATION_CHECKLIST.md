# AegisStay Implementation Checklist

This checklist maps the current project against the original hackathon idea for accelerated emergency response and crisis coordination in hospitality.

## Status Summary

Current state:

- The frontend product demo is built
- The site now includes multiple navigable product pages
- The Vite React project structure is in place
- A Windows batch launcher exists for local startup
- A first live NWS browser integration is now in place
- Real backend logic and most integrations are not implemented yet

Project maturity:

- Product concept: strong
- Frontend prototype: completed
- Backend/data integration: started
- Realtime incident operations: not started
- Production deployment: not started

## Completed

### Product and UX

- Brand and concept defined as `AegisStay`
- Modern landing page built
- Multi-page product site built inside the same React app
- Hospitality-focused crisis coordination story built into the UI
- Interactive scenario switching implemented
- Three audience views represented:
  - Guest PWA
  - Staff Command Center
  - Responder Link

### Demo Features Implemented in Frontend

- Scenario-based incident simulator
- Occupancy heatmap visualization
- Lockdown / evacuation / shelter mode storytelling
- Route and playbook visualization
- SOS and safe-status concepts in UI
- Responder secure-link concept in UI
- Roadmap and architecture sections in the website

### Project Setup

- Vite React structure restored
- `RunAegisStay.bat` added as shortcut to run the app
- `README.md` documents structure and file roles
- `IMPLEMENTATION_CHECKLIST.md` tracks delivery status

## Partially Completed

### Real-World Data Source Representation

These are represented in the product story or UI copy, with NWS now partially integrated:

- NWS real-time weather/hazard alerts
- OpenFEMA disaster and resilience data
- Indoor routing / floor-plan platform concepts
- Emergency dispatch and staging data concepts

What is now real:

- Browser fetch to the NWS active alerts endpoint by hotel point
- Live alert state rendered into the UI
- Refresh loop and error handling for the live feed

What is still missing for NWS:

- Incident normalization and storage
- Backend polling / proxy route
- Mapping alerts into hotel playbooks automatically

### Hackathon MVP Feature Representation

These are shown as demo concepts, but are not functional integrations yet:

- Guest SOS actions
- Assembly point / muster check-in
- Staff occupancy heatmap
- Digital responder briefing link
- Dynamic evacuation and lockdown workflows

## Not Started Yet

### Phase 1: Real Data

- Normalize NWS alerts into incident records
- Connect to OpenFEMA datasets
- Select and integrate one indoor mapping provider:
  - ArcGIS Indoors
  - MapsIndoors
  - MazeMap
- Add one public dispatch dataset for realism:
  - NYC OpenData
  - Open Data DC

### Phase 2: Solution Ecosystem

#### Guest Experience

- Real guest-safe flow
- Functional SOS submission
- Multilingual emergency broadcast logic
- QR muster check-in flow
- Offline support
- AR evacuation
- Bluetooth mesh fallback

#### Staff Dashboard

- Live realtime incident state
- Actual occupancy logic
- Staff action controls
- Assembly headcount reconciliation
- IoT override integration
- PMS or Wi-Fi integration

#### First Responder Link

- Real secure link generation
- Expiry and access control
- Real floor-plan payload
- Hazard and utility dataset support
- Incident feed for responders

### Phase 3: Hackathon Plumbing

- Database setup
- Realtime subscriptions
- API fetch services
- Simulator service for fake incidents
- Production build validation
- Deployment

## Priority Order For The Next Build Steps

### Priority 1: Unblock Local Development

- Install Node.js LTS and npm
- Run `RunAegisStay.bat`
- Verify `npm install`
- Verify `npm run dev`

### Priority 2: Finish the Hackathon MVP Backbone

- Add a backend choice:
  Supabase is the best fit for this project
- Create the core data model:
  hotel, floors, rooms, incidents, guest status, SOS, responder links
- Add a local simulator data layer
- Move scenario data out of `src/App.jsx` into a separate module

### Priority 3: Add One Real Trigger

- Move the NWS browser fetch behind a backend route or polling job
- Persist alerts as incident records
- Map relevant alert types to playbooks
- Convert alert state into actionable dashboard updates

### Priority 4: Make One Dashboard Truly Functional

- Build the staff dashboard first
- Make occupancy heatmap data-driven
- Add safe / SOS state updates
- Add assembly headcount logic
- Keep IoT features simulated for the hackathon demo

### Priority 5: Make One Guest Flow Truly Functional

- Build guest emergency card
- Add `I'm Safe` action
- Add `Need Help` / SOS action
- Add multilingual message templates

### Priority 6: Make The Responder Demo Real Enough

- Build a responder route/view page
- Show floor plan image or static floor overlay
- Show hazards, exits, and incident notes
- Use a mock secure token flow if full auth is too heavy

## Recommended Hackathon MVP Scope

Build for real:

- Staff dashboard with live incident state
- Guest safe / SOS flow
- Assembly headcount status
- One NWS-triggered incident pipeline

Keep as simulator or roadmap:

- AR evacuation
- Bluetooth mesh fallback
- Live IoT door and lighting integration
- CCTV streaming
- Full PMS and Wi-Fi triangulation

## Acceptance Criteria For MVP

The MVP should be considered complete when:

- The app runs locally through Vite
- One real NWS alert can create or update an incident
- Staff can see an incident dashboard with occupancy status
- Guests can submit `safe` or `SOS`
- Assembly status can be visualized
- Responders can open a briefing screen or route page
- The full demo can be presented in under 4 minutes

## Biggest Current Blockers

- Node.js and npm are not installed on the machine
- No backend or realtime database exists yet
- Only one live API integration exists, and it is still frontend-only
- Frontend logic is still concentrated in one large file

## Suggested Immediate Next Task

The best next implementation task is:

- Install Node.js LTS
- Start the Vite app
- Refactor the current frontend into reusable sections and data modules
- Move the new NWS integration into a backend-backed incident pipeline
