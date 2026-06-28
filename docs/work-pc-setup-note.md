# Work PC Setup Note

Use this note when opening RaminFlow from another computer.

## Expected Workspace

The active repositories should live inside Ubuntu WSL:

```bash
~/Dev/raminflow
~/Dev/SMK-Science
~/Dev/ramintuzelis.github.io
```

Do not work from the old Windows Desktop copies unless we intentionally decide to.

## Quick Environment Check

Run these in Ubuntu, not PowerShell:

```bash
cd ~/Dev/raminflow
git status -sb
node -v
npm -v
docker --version
docker compose version
```

Expected idea:

- Git should be clean or show only intentional local changes.
- Node should be available inside Ubuntu WSL, not only Windows.
- Docker Desktop should have WSL integration enabled for Ubuntu.

## First-Time Or Fresh-Machine Setup

If Node is missing inside Ubuntu:

```bash
sudo apt update
sudo apt install nodejs npm
```

Then install project dependencies:

```bash
cd ~/Dev/raminflow
npm install
```

Create local environment values if `.env` is missing:

```bash
cp .env.example .env
```

Start PostgreSQL:

```bash
docker compose up -d postgres
docker compose ps
```

Run migrations:

```bash
npx drizzle-kit migrate
```

Verify the project:

```bash
npm run lint
npm run format:check
npm exec tsc -- --noEmit
```

Start the app:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Important Reminder

Git brings the code and migration files, but local test orders live only inside that computer's Docker PostgreSQL volume. A fresh work PC database may be empty until we create demo data again.
