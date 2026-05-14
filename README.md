# NetGlance

NetGlance is an open-source, local-first dashboard for Home Assistant and NetAlertX users who want an always-on tablet view of network activity. It provides a slick, glanceable, dark dashboard without cloud services, accounts, telemetry, analytics, external tracking, or external device-identification APIs.

> NetGlance is not affiliated with NetAlertX or Home Assistant.

## Screenshots

Screenshots will be added in `docs/screenshots.md`. Enable `ENABLE_DEMO_MODE=true` for realistic fake data while taking screenshots.

## Privacy-first and local-first

- Runs entirely on your local network.
- No cloud backend, accounts, telemetry, analytics, external tracking, or external device fingerprinting API.
- Device data remains on your machine.
- SQLite database remains local.
- Browser never receives NetAlertX credentials.
- NetAlertX API access happens server-side only through Next.js route handlers.

## Features

- Tablet-first dark dashboard for kiosk/full-screen display.
- Summary cards for online, unknown, new-today, and recently disconnected devices.
- Recent joins/disconnects, latest event, alert overlay, stale/offline indicators.
- Device list, search/filter chips, and device detail drill-down.
- Server-Sent Events live updates.
- SQLite cache/history for devices, snapshots, events, alerts, acknowledgements, and health state.
- Demo mode for development and screenshots.
- Docker Compose deployment using Next.js standalone output.

## Requirements

- Node.js 22+ for development.
- Docker and Docker Compose for deployment.
- A separately running NetAlertX instance reachable from the NetGlance container.

## Docker Compose setup

```bash
cp .env.example .env
# edit NETALERTX_BASE_URL and optional token
mkdir -p data
docker compose up --build
```

Open <http://localhost:3030>.

## Environment variables

| Variable | Description |
| --- | --- |
| `NETALERTX_BASE_URL` | Server-side base URL (GraphQL port). Trailing `/docs` or `/graphql` is stripped. See [NetAlertX GraphQL API](https://github.com/netalertx/NetAlertX/blob/main/docs/API_GRAPHQL.md). |
| `NETALERTX_API_TOKEN` | Bearer token for GraphQL (and REST), sent only server-side. |
| `NETALERTX_GRAPHQL_DEVICE_STATUS` | Optional `devices(options)` status filter: `my_devices`, `connected`, `favorites`, `new`, `down`, `archived`, `offline`. Omit for no filter. |
| `NETALERTX_GRAPHQL_PAGE_LIMIT` | GraphQL devices page size (default 500, max 1000). |
| `POLL_INTERVAL_SECONDS` | Dashboard poll/SSE interval. |
| `SQLITE_DB_PATH` | Local SQLite path, e.g. `/app/data/netglance.sqlite`. |
| `APP_NAME` | Display name, defaults to NetGlance. |
| `APP_BASE_URL` | Optional externally visible base URL. |
| `ENABLE_SOUND_ALERTS` | Optional browser sound-alert flag. |
| `ENABLE_DEMO_MODE` | Use realistic local fake data without NetAlertX. |

## Connecting to NetAlertX

NetGlance loads devices using the [official GraphQL `devices` query](https://github.com/netalertx/NetAlertX/blob/main/docs/API_GRAPHQL.md) (`POST /graphql`, `GetDevices` + `PageQueryOptionsInput`: `page`, `limit`, `sort`, `search`, optional `status`). If GraphQL fails, it falls back to common REST device endpoints and normalises camelCase or legacy field names server-side.

## Tablet/kiosk usage

Open the dashboard in Chrome on your Android tablet, use Add to Home Screen where available, or run Chrome/kiosk mode via your preferred launcher. Landscape orientation is recommended for the dashboard overview.

## Development

```bash
cp .env.example .env
ENABLE_DEMO_MODE=true npm run dev
npm run test
npm run typecheck
npm run build
```

## Limitations

- NetAlertX API shapes vary; adapters may need refining for your instance.
- Device names/types come from local NetAlertX data only; no external MAC lookup is used.
- v1 intentionally avoids complex NetAlertX-level configuration screens.

## Roadmap

- Manual names/type overrides.
- Room/location grouping.
- Important-device pinning.
- Ignore/mute rules.
- Known/approved device workflow.
- Home Assistant add-on packaging.
