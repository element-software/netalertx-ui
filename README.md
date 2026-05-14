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
| `NETALERTX_BASE_URL` | Server-side base URL of your NetAlertX instance. |
| `NETALERTX_API_TOKEN` | Optional token, sent only server-side. |
| `POLL_INTERVAL_SECONDS` | Dashboard poll/SSE interval. |
| `SQLITE_DB_PATH` | Local SQLite path, e.g. `/app/data/netglance.sqlite`. |
| `APP_NAME` | Display name, defaults to NetGlance. |
| `APP_BASE_URL` | Optional externally visible base URL. |
| `ENABLE_SOUND_ALERTS` | Optional browser sound-alert flag. |
| `ENABLE_DEMO_MODE` | Use realistic local fake data without NetAlertX. |

## Connecting to NetAlertX

NetGlance tries common NetAlertX-style device endpoints and normalises the response server-side. Assumption for v1: device responses are either an array or an object with `devices`/`data`, with fields such as `dev_MAC`, `dev_Name`, `dev_LastIP`, `dev_Vendor`, and `dev_PresentLastScan`. TODO: confirm exact field names against more real NetAlertX versions and add endpoint adapters as needed.

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
