# ocus-focus — Web (frontend)

This is the Angular frontend for the ocus-focus project. It provides the user interface for the suite of case tools (Arcatest, Prioreasy, Flying Cards and Estima) and communicates with the API located at `api/v2`.

**What this app does**

- Presents dashboards, kanban boards, test-management screens, prioritization UIs and estimation forms.
- Consumes the ocus-focus backend API for authentication, data persistence and business operations.

## Quick start

1. Open a terminal in the `web/` folder.
2. Install dependencies:

```bash
cd web
npm install
```

3. Run the dev server (default port 4200):

```bash
npm start
# or
ng serve
```

4. Open your browser at `http://localhost:4200/`.

Note: by default the frontend expects the API to be available at a proxied path (see Proxy section) or at the URL configured in environment files.

## Project structure (important paths)

- `src/app/` — Angular modules, components and routing.
- `src/environments/` — Environment files used for dev/prod settings (API base URL, feature flags).
- `src/styles.css` — Global styles (Tailwind is included in the repo via `tailwind.config.js`).

## Backend connection / Proxy

During development it's convenient to proxy API calls from the frontend to the backend to avoid CORS and simplify URLs.

Create a `proxy.conf.json` at `web/` (example):

```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "info"
  }
}
```

And serve with the proxy enabled:

```bash
ng serve --proxy-config proxy.conf.json
```

This forwards requests starting with `/api` to the backend running on `localhost:3000` (the default `api/v2` port in the README). Alternatively update `src/environments/*.ts` to point `apiBaseUrl` to your backend URL.

## Environment files

- `src/environments/environment.ts` (development) and `src/environments/environment.prod.ts` (production) contain the `apiBaseUrl` and feature flags. Adjust these for your deployment.

## Build

Build the app for production:

```bash
npm run build
# or using Angular CLI
ng build --configuration production
```

The compiled files are output to `dist/` and can be served by any static server or placed behind your web server.

## Tests

- Unit tests: `npm run test` (runs Karma/Jasmine as configured by the project)
- E2E tests: `npm run e2e` (config depends on your e2e harness; you may need to install additional packages)

## Linting & formatting

- Lint: `npm run lint` (if configured)
- Format: use `prettier` or your editor config if present in the repository

## Docker (optional)

You can serve the built frontend via a small static image (example):

```bash
# build the app
cd web
npm run build

# serve the dist directory with a simple http server (or build an nginx image)
npx serve -s dist
```

## Common issues

- App can't reach API: check `proxy.conf.json` and the backend is running on the expected port (default `localhost:3000`).
- Styles not reflecting: ensure Tailwind is built and you're using the correct `styles.css` import.
- Port in use: change port with `ng serve --port 4201`.

## How this ties to the backend

- The frontend calls endpoints exposed by `api/v2` (see `api/v2/src/modules/` for feature mappings such as `caso-de-teste`, `priorizacao`, `kanban`, `estimativa`).
- For local development run the backend (`api/v2`) and the frontend with the proxy enabled to get an integrated environment.

---

If you'd like, I can:

- Add a `proxy.conf.json` file to `web/` and update `package.json` scripts to include `start:proxy`.
- Add example `apiBaseUrl` values to `src/environments/environment.ts` and `environment.prod.ts`.

Tell me which you want and I will apply the changes.
