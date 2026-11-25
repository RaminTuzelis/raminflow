# RaminFlow

RaminFlow is a production-order management learning prototype built with Next.js, TypeScript, PostgreSQL and Drizzle. It uses synthetic demonstration data. Personal learning context lives in the private `SMK-Science/learning-profile.md`; this repository and its Git history are the authority for implementation details.

## Current Scope

The application includes credentials login, required temporary-password replacement, role-based order access, administrator-managed users, order/item creation and editing, yearly order numbers, search/status filters, pagination and status history with the acting user.

Create Order reads the first sheet of `.xlsx` or Excel 2003 XML (`.xls`) files up to 5 MiB in the browser. Convert older binary `.xls` files to `.xlsx` before importing. Review the rows, correct any errors, optionally fill blank materials and thicknesses with defaults, then append ready items to the draft. Review the combined Added items list before saving the order. [Synthetic examples](docs/import-samples) are available for local testing.

This is a local learning prototype. A company pilot requires separately approved private data, infrastructure and deployment arrangements.

## Local Setup (Ubuntu / WSL2)

Use Node.js/npm in WSL and Docker with WSL integration. Run commands from the repository root. Install the locked dependencies:

```bash
npm ci
```

On a fresh checkout, copy `.env.example` to `.env`; preserve an existing local environment file. Replace placeholder values, especially `AUTH_SECRET` and `SEED_ADMIN_PASSWORD`, and keep `DATABASE_URL` consistent with the PostgreSQL settings. Environment files are ignored by Git.

For a **new, empty local database**, run:

```bash
docker compose up -d postgres
npx drizzle-kit migrate
npm run db:seed:admin
npm run db:seed:demo
npm run dev
```

Open [localhost:3000](http://localhost:3000) and sign in with the administrator credentials configured in `.env`. The new administrator must change the temporary password. The optional demo seed defines 50 orders and 101 items and skips insertion if any orders already exist; the administrator seed skips an existing matching email.

### Existing Databases On Another Computer

Git synchronizes source, migrations and seeds, **not PostgreSQL Docker volumes or environment values**. Inspect the existing local state before applying migrations or seeds. Do not remove a volume to resolve migration errors.

Migrations `0006` and `0008` add required creator/actor foreign keys without a historical-data backfill. A database containing older orders or status history needs a deliberate data plan before those migrations can succeed. Do not invent historical actors. The status-actor migration was previously checked on a fresh synthetic database, not retained old history.

## Source Map

| Location          | Responsibility                                                    |
| ----------------- | ----------------------------------------------------------------- |
| `src/app/`        | Pages, Auth.js route and Server Actions                           |
| `src/components/` | Domain forms, lists, dialogs and owned UI primitives              |
| `src/types/`      | Order, item, draft, user-role and session contracts               |
| `src/db/`         | Drizzle client, schema, queries and mapping                       |
| `src/lib/`        | Permissions, current user, domain options, pure helpers and tests |
| `drizzle/`        | Committed SQL migrations and generated metadata                   |
| `scripts/`        | Synthetic administrator and order seeds                           |
| `docs/`           | Synthetic workbook fixtures and editable diagrams                 |

Order creation collects manual and imported items in `src/components/create-order-form.tsx` and calls `src/app/orders/new/actions.ts` for authorization, validation and transactional persistence.

Status history stores `changedByUserId` and joins the user's current name for display. Status transitions currently accept any supported status. Order quantities use a PostgreSQL integer column, and the spreadsheet preview accepts positive whole numbers.

## Checks And Development

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

Vitest currently covers permissions, supported values, order-number formatting and pagination helpers. These checks do not replace browser or database workflow verification. A build needs the local environment configured, and the Google font setup in `src/app/layout.tsx` may need network access.

Read [AGENTS.md](AGENTS.md) before changes. For Next.js implementation work, consult the relevant installed guides under `node_modules/next/dist/docs/` as instructed there. Keep real employer data and personal learning-profile contents out of this public repository.
