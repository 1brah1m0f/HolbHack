# Source Layout

This project uses Next.js App Router, but application code is split by ownership so feature branches stay clean.

## Folders

- `app/`: Next.js routing only. Keep pages, layouts, global CSS, and route adapter files here.
- `frontend/`: Client UI, feature screens, reusable components, and React hooks.
- `backend/`: API handlers, server-only services, validation, LLM integrations, and data access.
- `shared/`: Types and contracts used by both frontend and backend.

## Branch Ownership

- Frontend branches should mostly touch `src/frontend` and route entry points in `src/app`.
- Backend branches should mostly touch `src/backend` and API adapters in `src/app/api`.
- API contract branches should touch `src/shared/types` first, then update callers.

Route files in `src/app/api` should stay thin. Put real backend logic in `src/backend/http` or deeper service folders.
