import type { Alert, Device, NetAlertXEvent } from '@/lib/netalertx/types';

export function createAlerts(events: NetAlertXEvent[], devices: Device[], existing: Alert[] = []): Alert[] {
  const byId = new Map(devices.map((d) => [d.id, d]));
  const acknowledged = new Set(existing.filter((a) => a.acknowledgedAt).map((a) => a.deviceId).filter(Boolean));
  const pending = new Set(existing.filter((a) => !a.acknowledgedAt).map((a) => a.deviceId).filter(Boolean));
  const out: Alert[] = [];
  const added = new Set<string>();

  for (const event of events) {
    if (!['device_joined', 'device_first_seen', 'device_reconnected'].includes(event.type) || !event.deviceId) continue;
    const d = byId.get(event.deviceId);
    if (!d?.isUnknown || acknowledged.has(d.id) || pending.has(d.id) || added.has(d.id)) continue;
    added.add(d.id);
    out.push({
      id: `unknown:${d.id}:${event.at}`,
      type: 'unknown_device',
      deviceId: d.id,
      title: 'Unknown device detected',
      message: `${d.displayName} appeared on the network`,
      severity: 'warning',
      createdAt: event.at,
      payload: { ipAddress: d.ipAddress, macAddress: d.macAddress, vendor: d.vendor, deviceType: d.deviceType },
    });
  }
  return out;
}
