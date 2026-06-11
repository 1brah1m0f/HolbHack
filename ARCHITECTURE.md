# RPG Recall Architecture

## Goal

The project is a single Next.js application with clear code ownership boundaries:

- `src/app`: framework routing layer
- `src/frontend`: browser UI layer
- `src/backend`: server/API layer
- `src/shared`: frontend/backend contracts

This keeps the app easy to run as one project while allowing frontend, backend, and contract work to happen on separate branches with fewer conflicts.

## Runtime Flow

```text
Browser UI
  -> src/frontend hooks
  -> /api route in src/app/api
  -> handler in src/backend/http
  -> backend services in src/backend/services
  -> shared response contract from src/shared/types
  -> Browser UI
```

## Layer Rules

### `src/app`

Next.js owns this folder. Keep it focused on file conventions:

- `page.tsx` renders frontend feature screens.
- `layout.tsx` owns root layout and metadata.
- `api/*/route.ts` re-exports handlers from `src/backend/http`.
- `globals.css` keeps global Tailwind and base styles.

Do not place large UI or business logic here.

### `src/frontend`

Browser-facing code lives here:

- `features/`: complete screens and workflows
- `components/`: reusable components
- `hooks/`: client-side data fetching and UI state

Frontend code may import from `src/shared`, but should not import backend services or read server secrets.

### `src/backend`

Server-side logic lives here:

- `http/`: Next Route Handler implementations
- `services/`: LLM clients, game data, future database integrations
- `validation/`: request and provider response validation

Backend code may import shared contracts from `src/shared`.

### `src/shared`

Shared types and contracts live here. Treat this as the API agreement between branches.

Change contract files intentionally and update both callers when needed.

## Current API

- `GET /api/games`: returns supported and coming-soon games.
- `POST /api/recall`: validates a player memory request, builds a game-specific prompt, calls the LLM service, validates the model response, and returns a typed recap.

## Branch Strategy

- `frontend/*`: UI, layout, components, client hooks.
- `backend/*`: API handlers, validation, LLM/game/database services.
- `contract/*`: shared API/domain types.
- `docs/*`: README and architecture changes.

When possible, branch work should touch only one ownership area plus any required shared contract update.
