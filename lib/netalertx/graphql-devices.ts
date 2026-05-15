import { getEnv } from '@/lib/utils/env';
import { normaliseDevice } from '@/lib/netalertx/normalise-device';
import type { Device, RawNetAlertXDevice } from '@/lib/netalertx/types';
import { postGraphQL } from '@/lib/netalertx/graphql-client';
import { normaliseMac } from '@/lib/utils/mac';

/** Matches NetAlertX docs sample: GetDevices + PageQueryOptionsInput. */
/** Fields aligned with NetAlertX `Devices` table / GraphQL schema (see docs/DATABASE.md). */
const GET_DEVICES = `query GetDevices($options: PageQueryOptionsInput) {
  devices(options: $options) {
    devices {
      rowid
      devMac
      devName
      devOwner
      devGroup
      devLocation
      devStaticIP
      devType
      devVendor
      devLastIP
      devFQDN
      devFirstConnection
      devLastConnection
      devPresentLastScan
      devStatus
    }
    count
  }
}`;

type DevicesQueryData = {
  devices: {
    devices: Record<string, unknown>[];
    count: number;
  };
};

function graphqlRowToRaw(row: Record<string, unknown>): RawNetAlertXDevice {
  return {
    id: row.rowid as string | number | undefined,
    dev_MAC: row.devMac as string | undefined,
    dev_Name: row.devName as string | undefined,
    dev_Vendor: row.devVendor as string | undefined,
    dev_DeviceType: row.devType as string | undefined,
    dev_LastIP: row.devLastIP as string | undefined,
    devFQDN: row.devFQDN as string | undefined,
    dev_FirstConnection: row.devFirstConnection as string | undefined,
    dev_LastConnection: row.devLastConnection as string | undefined,
    dev_PresentLastScan: row.devPresentLastScan as RawNetAlertXDevice['dev_PresentLastScan'],
    status: row.devStatus as string | undefined,
    devStatus: row.devStatus as string | undefined,
    devOwner: row.devOwner as string | number | undefined,
    devGroup: row.devGroup as string | number | undefined,
    devLocation: row.devLocation as string | number | undefined,
    devStaticIP: row.devStaticIP as RawNetAlertXDevice['devStaticIP'],
  };
}

/** Build options to mirror official curl: sort, search; optional status (e.g. connected, my_devices). */
function pageQueryOptions(page: number, limit: number) {
  const env = getEnv();
  const options: Record<string, unknown> = {
    page,
    limit,
    sort: [{ field: 'devName', order: 'asc' }],
    search: '',
  };
  if (env.netalertxGraphqlDeviceStatus) options.status = env.netalertxGraphqlDeviceStatus;
  return options;
}

/** Same rows NetAlertX GraphQL reads from disk (`server/api_server/graphql_endpoint.py`). */
function extractTableDeviceRows(json: unknown): Record<string, unknown>[] | null {
  if (Array.isArray(json)) return json as Record<string, unknown>[];
  if (!json || typeof json !== 'object') return null;
  const o = json as Record<string, unknown>;
  if (Array.isArray(o.data)) return o.data as Record<string, unknown>[];
  const withSuccess = o as { success?: boolean; devices?: unknown[] };
  if (Array.isArray(withSuccess.devices) && withSuccess.success !== false) {
    return withSuccess.devices as Record<string, unknown>[];
  }
  if (Array.isArray(o.devices)) return o.devices as Record<string, unknown>[];
  return null;
}

/**
 * Fetches `table_devices.json` over HTTP (same snapshot GraphQL uses server-side).
 * The published GraphQL doc shows only a subset of columns; the table export usually carries full
 * `DevicesView` rows (group, location, static IP, etc.).
 */
export async function fetchDevicesTableJson(baseUrl: string, token: string): Promise<Device[] | null> {
  const root = baseUrl.replace(/\/$/, '');
  const paths = ['/api/table_devices.json', '/table_devices.json', '/php/server/table_devices.json'];
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  for (const path of paths) {
    try {
      const res = await fetch(`${root}${path}`, { headers, cache: 'no-store' });
      if (!res.ok) continue;
      const json = (await res.json()) as unknown;
      const rows = extractTableDeviceRows(json);
      if (!rows) continue;
      return rows.map((row) => normaliseDevice(row as RawNetAlertXDevice, 'netalertx'));
    } catch {
      continue;
    }
  }
  return null;
}

/** Overlay metadata from the table export onto GraphQL rows matched by normalised MAC. */
export function mergeDeviceMetadata(primary: Device[], fromTableExport: Device[]): Device[] {
  const byMac = new Map<string, Device>();
  for (const d of fromTableExport) {
    const mac = normaliseMac(d.macAddress);
    if (mac) byMac.set(mac, d);
  }
  return primary.map((d) => {
    const mac = normaliseMac(d.macAddress);
    const t = mac ? byMac.get(mac) : undefined;
    if (!t) return d;
    return {
      ...d,
      owner: t.owner ?? d.owner,
      group: t.group ?? d.group,
      location: t.location ?? d.location,
      staticIp: t.staticIp ?? d.staticIp,
    };
  });
}

async function enrichFromTableExport(baseUrl: string, token: string, gqlDevices: Device[]): Promise<Device[]> {
  const table = await fetchDevicesTableJson(baseUrl, token);
  if (!table?.length) return gqlDevices;
  return mergeDeviceMetadata(gqlDevices, table);
}

/**
 * Loads devices via NetAlertX GraphQL (POST /graphql), documented at
 * <https://github.com/netalertx/NetAlertX/blob/main/docs/API_GRAPHQL.md>.
 * Paginates until a short or empty page (do not trust `count` alone for termination).
 */
export async function fetchDevicesGraphQL(baseUrl: string, token: string): Promise<Device[]> {
  const limit = getEnv().netalertxGraphqlPageLimit;
  const all: Device[] = [];
  let page = 1;
  for (;;) {
    const data = await postGraphQL<DevicesQueryData>(baseUrl, token, {
      query: GET_DEVICES,
      operationName: 'GetDevices',
      variables: { options: pageQueryOptions(page, limit) },
    });
    const payload = data.devices;
    const chunk = payload?.devices ?? [];
    for (const row of chunk) {
      all.push(normaliseDevice(graphqlRowToRaw(row), 'netalertx'));
    }
    // Terminate using page shape only. Relying on `count` caused early exit when the server
    // total differed from fetched rows (under-count vs this process).
    if (chunk.length === 0) break;
    if (chunk.length < limit) break;
    page += 1;
    if (page > 500) break;
  }
  return enrichFromTableExport(baseUrl, token, all);
}
