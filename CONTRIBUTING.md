# Contributing to AegisStay

Thanks for helping improve AegisStay. This project is meant to be easy to fork, adapt, and extend for hospitality safety demos and real operational tools.

## Ways to Contribute

- Improve the React UI or accessibility
- Add real data integrations such as NWS or OpenFEMA
- Refactor the app into smaller reusable components
- Add deployment, testing, and CI support
- Adapt the project for resorts, campuses, hospitals, cruise ships, or event venues
- Improve docs for contributors and fork maintainers

## Local Setup

1. Install Node.js LTS
2. Clone the repo
3. Run `npm install`
4. Run `npm run dev`
5. Open `http://localhost:5173`

You can also use `RunAegisStay.bat` on Windows.

## Project Conventions

- Keep changes small and focused
- Prefer clear names over clever abstractions
- Preserve the existing visual direction unless you are intentionally redesigning a section
- Document new data sources and assumptions in `README.md`
- If you add a new integration, make the failure state visible in the UI

## Suggested Contribution Areas

- `src/App.jsx`
  Improve layout structure, section composition, and state management
- `src/nws.js`
  Expand live alert handling or move it behind a backend
- `src/phaseOneTasks.js`
  Keep roadmap status aligned with the actual implementation
- `README.md`
  Keep onboarding and adaptation instructions current

## Pull Request Guidance

- Describe what changed
- Explain why the change helps the product or contributors
- Mention any tradeoffs or follow-up work
- Include screenshots for UI changes when possible

## Good First Issues

- Split scenario data into a dedicated module
- Add OpenFEMA demo integration
- Add dark/light theme toggle
- Add a static floor-plan panel for the responder view
- Add better mobile navigation
