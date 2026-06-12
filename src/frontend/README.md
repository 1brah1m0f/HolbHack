# Frontend

Client-facing React code lives here.

## Structure

- `features/`: top-level screens and route-facing compositions.
- `components/layout/`: app shell, navigation, and persistent chrome.
- `components/reconstruct/`: reconstruction workspace UI.
- `components/archives/`: archive browser panels and cards.
- `components/index/`: game index dashboard sections.
- `components/settings/`: settings and control surfaces.
- `hooks/`: browser-side data fetching and state hooks.
- `data/`: frontend-only mock content and dashboard seed data.

Use shared API contracts from `@/shared/types`. Keep server secrets and provider logic out of this folder.
