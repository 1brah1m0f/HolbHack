# Backend

Server-side code lives here.

- `http/`: Route Handler implementations used by `src/app/api`.
- `services/`: Integrations and domain services.
- `validation/`: Request and provider response validation.

Keep `src/app/api/*/route.ts` files as thin adapters that export handlers from this folder.
