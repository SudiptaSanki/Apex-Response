# Adaptation Guide

AegisStay is intentionally opinionated in design, but flexible in concept. You can adapt it well beyond the current hotel demo.

## Fastest Ways to Customize

### 1. Change the pilot property

Update the demo property in `src/nws.js`:

- name
- city
- latitude
- longitude

This lets you point the live NWS feed at a different U.S. property.

## 2. Change the scenarios

Update the scenario objects in `src/App.jsx`:

- labels
- crisis types
- heatmap values
- route steps
- guest, staff, and responder copy

## 3. Change the product framing

Update:

- hero copy in `src/App.jsx`
- roadmap items in `src/App.jsx`
- docs in `README.md` and `IMPLEMENTATION_CHECKLIST.md`

## 4. Add your own data source

Recommended order:

1. NWS alerts
2. OpenFEMA context
3. One indoor floor-plan provider
4. One dispatch dataset

## Best Forking Patterns

### Hospitality operators

Adapt for:

- urban hotels
- resorts
- casino properties
- conference venues
- multi-building campuses

### Adjacent sectors

Adapt for:

- hospitals
- universities
- airports
- cruise ships
- stadiums
- convention centers

## Technical Adaptation Ideas

- Move scenario content into dedicated data modules
- Replace browser-side API fetches with backend endpoints
- Add Supabase for realtime incident state
- Add auth for staff and responder portals
- Add deployment on Vercel or Netlify
- Add a static JSON mode for demoing without internet access

## Product Adaptation Ideas

- Accessibility-first evacuation mode
- Family reunification board
- Staff sweep assignments
- Indoor air quality / wildfire smoke mode
- Utility outage and generator readiness view
- Shelter-in-place supply readiness dashboard
