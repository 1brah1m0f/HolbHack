# RPG Recall

RPG Recall helps players remember where they left off in RPG games after a long break. It is a single Next.js app, but the source code is split into frontend, backend, and shared contract areas so branch work stays clean.

## Tech Stack

- Frontend: Next.js 16 App Router, React, TypeScript, Tailwind CSS
- Backend: Next.js Route Handlers as a backend-for-frontend API layer
- AI: OpenAI-compatible LLM client
- State: React hooks

## Source Layout

```text
src/
├── app/                    # Next.js routing only
│   ├── api/                # Thin API route adapters
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage route entry
│   └── globals.css         # Global styles
├── frontend/               # Client UI owned by frontend branches
│   ├── components/         # UI and feature components
│   ├── features/           # Screens and workflows
│   └── hooks/              # Browser-side hooks
├── backend/                # Server logic owned by backend branches
│   ├── http/               # Route Handler implementations
│   ├── services/           # LLM and game services
│   └── validation/         # Request/response validation
└── shared/                 # Contracts used by both sides
    └── types/              # API and domain TypeScript types
```

## Branch Workflow

- Frontend work: prefer `src/frontend`.
- Backend work: prefer `src/backend`.
- API contract work: update `src/shared/types` first, then update frontend/backend callers.
- Next.js route files in `src/app` should stay small. Put real UI in `src/frontend` and real API logic in `src/backend`.

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Set your LLM key in `.env.local`:

```env
OPENAI_API_KEY=your-actual-api-key-here
```

## Scripts

- `npm run dev`: start local development
- `npm run build`: production build
- `npm start`: start production server
- `npm run lint`: run ESLint

## API

- `GET /api/games`: returns supported and coming-soon games
- `POST /api/recall`: analyzes a player's remembered progress and returns a structured recap

## Adding a Game

1. Add game metadata and prompt data in `src/backend/services/games/games.ts`.
2. Add any needed shared contract changes in `src/shared/types`.
3. Add frontend display changes in `src/frontend`.
