import { fetchDevicesGraphQL } from '@/lib/netalertx/graphql-devices';
import { getEnv } from '@/lib/utils/env';
import { normaliseDevice } from './normalise-device';
import type { Device, RawNetAlertXDevice } from './types';
export class NetAlertXClient {
  private baseUrl: string;
  private token: string;
  constructor() {
    const env = getEnv();
    this.baseUrl = env.netalertxBaseUrl.replace(/\/$/, '');
    this.token = env.netalertxApiToken;
  }
  async getDevices(): Promise<Device[]> {
    if (getEnv().demoMode) return demoDevices();
    if (!this.baseUrl) throw new Error('NETALERTX_BASE_URL is not configured');
    let lastError: unknown;
    try {
      return await fetchDevicesGraphQL(this.baseUrl, this.token);
    } catch (graphqlError) {
      lastError = graphqlError;
    }
    const endpoints = ['/api/devices', '/devices', '/api/table_devices.json'];
    for (const path of endpoints) {
      try {
        const res = await fetch(`${this.baseUrl}${path}`, {
          headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
          cache: 'no-store',
        });
        if (!res.ok) {
          lastError = new Error(`NetAlertX returned ${res.status}`);
          continue;
        }
        const json = (await res.json()) as unknown;
        const fromSuccess = json as { success?: boolean; devices?: unknown[] };
        const rows = Array.isArray(json)
          ? json
          : Array.isArray(fromSuccess.devices) && fromSuccess.success !== false
            ? fromSuccess.devices
            : Array.isArray((json as { devices?: unknown[] }).devices)
              ? (json as { devices: unknown[] }).devices
              : Array.isArray((json as { data?: unknown[] }).data)
                ? (json as { data: unknown[] }).data
                : [];
        return rows.map((d) => normaliseDevice(d as RawNetAlertXDevice));
      } catch (error) {
        lastError = error;
      }
    }
    if (lastError instanceof Error) {
      throw lastError;
    }
    throw new Error('Unable to fetch NetAlertX devices');
  }
}
export function demoDevices(): Device[] {
  const now = Date.now();
  return [
    [
      "router",
      "Core Router",
      "192.168.1.1",
      "00:11:22:33:44:55",
      "Ubiquiti",
      "router",
      true,
      14,
    ],
    [
      "tv",
      "Living Room Shield",
      "192.168.1.23",
      "02:AA:BB:CC:DD:10",
      "NVIDIA",
      "media",
      true,
      1,
    ],
    [
      "phone",
      "Private MAC / Unknown Mobile Device",
      "192.168.1.87",
      "6A:11:22:33:44:55",
      undefined,
      "phone",
      true,
      0.2,
    ],
    [
      "nas",
      "Media NAS",
      "192.168.1.50",
      "00:22:33:44:55:66",
      "Synology",
      "server",
      false,
      20,
    ],
  ].map(([id, name, ip, mac, vendor, type, on, days]) => ({
    id: String(id),
    name: String(name),
    displayName: String(name),
    ipAddress: String(ip),
    macAddress: String(mac),
    vendor: vendor as string | undefined,
    deviceType: String(type),
    status: on ? "online" : "offline",
    isOnline: Boolean(on),
    isKnown: id !== "phone",
    isNew: Number(days) < 1,
    isUnknown: id === "phone",
    isPrivateMac: String(mac).startsWith("6A"),
    firstSeen: new Date(now - Number(days) * 86400000).toISOString(),
    lastSeen: new Date(now - 600000).toISOString(),
    lastConnected: on ? new Date(now - 600000).toISOString() : undefined,
    lastDisconnected: on ? undefined : new Date(now - 300000).toISOString(),
    connectedDurationSeconds: on ? 600 : undefined,
    source: "demo",
  }));
}
