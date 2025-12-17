# ocus-focus

ocus-focus is a small suite of case tools and supporting services that help teams with testing, requirements prioritization, kanban/board-based task management and cost/effort estimation. This repository contains both the backend API (v1 and v2 folders) and the Angular frontend used to access the tools.

This top-level README explains the project's purpose, the pieces that make it up, and how the repository is organized. For detailed installation and runtime instructions for each component, see the component READMEs (`api/v2/README.md` and `web/README.md`).

**Contents**

- **Overview** — What the project is and why it exists.
- **Project Suite** — High-level description of the four tools included.
- **Architecture** — How pieces fit together.
- **Quick start** — Where to look for install/run instructions.
- **Repository layout** — Important folders and what they contain.
- **Contributing & development** — How to help and common tasks.
- **License & contact** — Legal and contact information.

## Overview

ocus-focus combines four focused tools into a single platform to support software engineering lifecycle activities:

- Test planning and execution
- Requirements prioritization
- Visual task management (Kanban)
- Cost and effort estimation

The goal is to provide teams with an integrated environment where project artifacts, estimates and work items are stored consistently and can be used across planning and execution workflows.

## Project Suite

This repository supports the following case tools:

- **Arcatest** — Test planning and management: test case creation, test runs, results and reporting.
- **Prioreasy** — Requirements prioritization: capture requirements and apply prioritization techniques to produce ranked backlogs.
- **Flying Cards** — Kanban/board management: cards, columns and simple workflow automation for teams.
- **Estima** — Cost/effort estimation: models and tools to create estimativas used in planning and decision making.

Each tool reuses common services provided by the backend API (authentication, persistence, user management) and is surfaced through the Angular frontend in `web/`.

## Architecture

- Backend: `api/v2` (NestJS + TypeORM) provides REST endpoints, authentication, persistence and migrations. A `docker-compose.yml` is included to run a local MySQL instance for development.
- Frontend: `web/` (Angular) is the single-page client that consumes the backend API and provides the UIs for the four tools.
- Database: relational DB (MySQL or Postgres) used by the API. The `api/v2` folder contains example Docker compose for local DB usage.

Services are designed to be run independently so you can run the backend and frontend locally during development, or deploy them separately in production.

## Quick start (high level)

1. Backend: see `api/v2/README.md` for step-by-step instructions on installing dependencies, configuring `.env`, copying `src/data-source.example.ts` to `src/data-source.ts`, running migrations and starting the server.
2. Database: `api/v2/docker-compose.yml` can start a local MySQL for development; the `api/v2/README.md` documents how to create the DB and user.
3. Frontend: see `web/README.md` for installing dependencies and running the dev server. It also contains guidance for proxying API calls to the backend during local development.

If you want me to perform any of these steps for you (add scripts, generate `data-source.ts`, add `proxy.conf.json`, or add a compose file that runs backend + db together), tell me which and I will apply the changes.

## Repository layout

- `api/` — Backend code. Contains `v1/` (older code) and `v2/` (current NestJS implementation). Look into `api/v2/src/modules/` for domain modules.
- `web/` — Angular frontend code.
- `db/` — Database scripts and raw data files.
- `README.md` files in `api/v2` and `web` — component-specific setup and usage.

## Contributing & development

- Development workflow: run the backend and frontend locally (see each component README). Use the provided Docker compose in `api/v2` to bootstrap a DB for local testing.
- Coding style: follow TypeScript/NestJS conventions in `api/v2` and Angular style in `web`.
- Testing: `api/v2` and `web` each provide test scripts — consult their READMEs for exact commands.

If you're planning to contribute, open an issue with your proposal first or send a short note describing the change you want to implement.

## License & contact

See the repository LICENSE (if present) for licensing details. For questions or help with the code in this repo, open an issue or contact the maintainers listed in the project metadata.
