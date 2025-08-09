## great minds

A small party game to play with your friends. Built as a monorepo with a Colyseus realtime server and a React + Vite web client.

### TL;DR

```bash
pnpm i

# in one terminal (API on http://localhost:2567)
pnpm --filter @greatminds/api dev

# in another terminal (Web on http://localhost:5173)
VITE_API_URL=http://localhost:2567 pnpm --filter @greatminds/web dev
```

### Monorepo structure

```
greatminds/
├─ apps/
│  ├─ api/        # Colyseus server (TypeScript)
│  └─ web/        # React + Vite client (TypeScript)
├─ turbo.json      # Turborepo tasks
├─ pnpm-workspace.yaml
└─ package.json    # workspace scripts
```

### Tech stack

- Server: Colyseus, Express, TypeScript
- Client: React 18, Vite 5, Ant Design 5, React Query, Zustand, i18next
- Tooling: pnpm workspaces, Turborepo, ESLint, Prettier

### Requirements

- Node.js >= 18
- pnpm (repo uses `packageManager: pnpm@9`)

### Getting started

1. Install dependencies

```bash
pnpm i
```

2. Start the API (dev)

```bash
pnpm --filter @greatminds/api dev
# API listens on port 2567 by default (can be overridden by PORT)
```

3. Start the Web app (dev)

```bash
VITE_API_URL=http://localhost:2567 pnpm --filter @greatminds/web dev
# Web runs on http://localhost:5173 (Vite default)
```

Alternatively, you can run both with the workspace dev script:

```bash
pnpm dev
# Uses Turborepo to run each package's dev script
```
