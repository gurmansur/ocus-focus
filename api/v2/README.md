<!--
  Clean, project-specific README for the ocus-focus API v2.
  This file intentionally avoids the original Nest starter boilerplate.
-->

# ocus-focus — API (v2)

Short: Backend API for the ocus-focus web client. Implements endpoints and persistence for projects, colaboradores, requisitos, priorizacao, estimativas, and related domain models.

**Contents**

- **Overview** — What this service provides and the stack used.
- **Quickstart** — Install, configure `.env`, create `src/data-source.ts`, run migrations and start the server.
- **Configuration** — Variables and `data-source` guidance.
- **Migrations & scripts** — Commands and recommended npm scripts.
- **Troubleshooting & tests** — Common fixes and how to run tests.

## Overview

- Purpose: Serve REST and internal APIs consumed by the `web/` client in this repository.
- Primary tech: NestJS (TypeScript), TypeORM, and a relational DB (Postgres or MySQL).

## Project Suite

This repository backs a suite of four case tools that together provide project and product engineering workflows:

- **Arcatest** — Test planning and management (test case creation, execution tracking, and reporting).
- **Prioreasy** — Requirements prioritization and decision support for ordering features and requirements.
- **Flying Cards** — Kanban/board management for task and workflow visualization (cards, columns, swimlanes).
- **Estima** — Cost and effort estimations used to produce estimativas and support planning.

The API provides shared persistence, authentication and domain endpoints used by those tools. You can find corresponding functionality exposed across modules in `src/modules/` (for example `caso-de-teste`, `priorizacao`, `kanban`, `estimativa`).

## Quickstart

1. Open a terminal in `api/v2`.
2. Install dependencies:

```bash
cd api/v2
npm install
```

3. Configure environment variables (see next section).
4. Copy the TypeORM data source example and confirm it reads your `.env`:

```bash
cp src/data-source.example.ts src/data-source.ts
```

5. Run migrations (choose dev or build approach below).
6. Start the app in dev mode:

```bash
npm run start:dev
```

## Database (Docker)

A simple local MySQL instance is provided by `api/v2/docker-compose.yml` to make local development easier. The compose file exposes MySQL on the host port `3306`, and uses a persistent volume `mysql-data`.

Quick steps:

```bash
# from api/v2
docker-compose up -d

# view logs
docker-compose logs -f
```

Default container details (from `docker-compose.yml`):

- Image: `mysql:latest`
- Container name: `v2-container`
- Root password: `root` (set via `MYSQL_ROOT_PASSWORD`)
- Host port: `3306` -> container port `3306`
- Volume: `mysql-data` mounted at `/var/lib/mysql`

Create the database and a user for the app (example):

```bash
# run MySQL client inside the container to create DB and user
docker exec -it v2-container mysql -uroot -proot -e "CREATE DATABASE IF NOT EXISTS ocus_focus_db; CREATE USER IF NOT EXISTS 'ocus_user'@'%' IDENTIFIED BY 'secret'; GRANT ALL PRIVILEGES ON ocus_focus_db.* TO 'ocus_user'@'%'; FLUSH PRIVILEGES;"
```

Update your `api/v2/.env` to use these values when connecting to the local MySQL instance:

```
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=ocus_user
DB_PASSWORD=secret
DB_NAME=ocus_focus_db
```

Notes:

- If you run the backend inside Docker as well, the DB host used by the backend service should be the compose service name `mysql` (not `localhost`). Adjust `DB_HOST` accordingly.
- If you prefer PostgreSQL, you can replace the `mysql` service in `docker-compose.yml` or create a separate compose file for Postgres and update your `.env` and `src/data-source.ts`.

## Configuration

Create or update `api/v2/.env`. Minimal recommended values:

```
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=ocus_user
DB_PASSWORD=secret
DB_NAME=ocus_focus_db

PORT=3000
JWT_SECRET=replace_with_secure_value
```

- If you use MySQL change `DB_TYPE` and `DB_PORT` accordingly.
- Make sure the DB user has privileges to create/alter tables when running migrations.

data-source notes

- `src/data-source.example.ts` is provided to show the expected DataSource configuration. After copying it to `src/data-source.ts` confirm:
  - It reads the same env variables you set in `.env`.
  - `entities` and `migrations` globs match your runtime (`.ts` during development, `.js` after `npm run build`).

Example DataSource (expected shape):

```ts
import { DataSource } from 'typeorm';

export default new DataSource({
  type: (process.env.DB_TYPE as any) || 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
});
```

## Migrations

Two common workflows:

- Dev (run migrations directly from TypeScript sources)

```bash
# ensure helpers are available
npm install --save-dev typeorm ts-node typescript

# run migrations (example)
npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts
```

- CI/Production (build then run migrations against compiled code)

```bash
npm run build
npx typeorm migration:run -d dist/data-source.js
```

Recommended npm scripts (add to `api/v2/package.json` if helpful):

```json
"scripts": {
  "build": "nest build",
  "start:dev": "nest start --watch",
  "start:prod": "node dist/main.js",
  "migration:run": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d src/data-source.ts",
  "migration:generate": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate -n"
}
```

Adjust scripts if your repo already defines equivalents.

## Running the app

- Development: `npm run start:dev`
- Build: `npm run build`
- Production: `npm run start:prod`

## Tests

- Unit tests: `npm run test`
- E2E tests: `npm run test:e2e`

## Troubleshooting

- Connection errors: verify `.env` values and that the DB is reachable from your container/host.
- Migration path errors: confirm `data-source` uses `*.ts` globs in dev and `*.js` after build.
- Permission errors: ensure the DB user has create/alter privileges for migrations.

## What I can do next (offer)

- Add the recommended `migration:*` scripts to `api/v2/package.json`.
- Generate a `src/data-source.ts` file from `src/data-source.example.ts` using example env values.

If you'd like either, tell me which one and (optionally) the DB type and example credentials.
