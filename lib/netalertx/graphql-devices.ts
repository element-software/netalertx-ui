import { getEnv } from '@/lib/utils/env';
import { normaliseDevice } from '@/lib/netalertx/normalise-device';
import type { Device, RawNetAlertXDevice } from '@/lib/netalertx/types';
import { postGraphQL } from '@/lib/netalertx/graphql-client';

/** Matches NetAlertX docs sample: GetDevices + PageQueryOptionsInput. */
/** Fields aligned with NetAlertX `Devices` table / GraphQL schema (see docs/DATABASE.md). */
const GET_DEVICES = `query GetDevices($options: PageQueryOptionsInput) {
  devices(options: $options) {
    devices {
      rowid
      devMac
      devName
      devOwner
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
  return all;
}
