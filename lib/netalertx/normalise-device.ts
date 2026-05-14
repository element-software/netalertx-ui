import { secondsBetween } from '@/lib/utils/duration';
import { parseDate } from '@/lib/utils/dates';
import { pickMeaningfulString } from '@/lib/netalertx/display-name';
import { isPrivateMac, normaliseMac, stableDeviceId } from '@/lib/utils/mac';
import type { Device, RawNetAlertXDevice } from './types';

function pickString(...values: unknown[]) {
  return values.find((v): v is string => typeof v === 'string' && v.trim().length > 0)?.trim();
}

/** NetAlertX `devStatus` values include `On-line`, `Off-line`, `Sleeping`, `Down` (see docs/DATABASE.md). */
function online(raw: RawNetAlertXDevice) {
  const scan =
    raw.dev_PresentLastScan ??
    raw.devPresentLastScan ??
    (raw as { dev_PresentLastScan?: unknown }).dev_PresentLastScan;
  if (scan !== undefined && scan !== null) {
    if (typeof scan === 'boolean') return scan;
    if (typeof scan === 'number') return scan === 1;
    if (typeof scan === 'string') {
      const t = scan.toLowerCase();
      if (['0', 'false', 'no', 'off', 'down', 'offline'].includes(t)) return false;
      if (['1', 'true', 'yes', 'on', 'up', 'online'].includes(t)) return true;
    }
  }
  const v = raw.online ?? raw.status ?? raw.devStatus ?? (raw as { dev_Status?: string }).dev_Status;
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v === 1;
  if (typeof v === 'string') {
    const norm = v.toLowerCase().replace(/\s+/g, '');
    if (['down', 'offline', 'off-line', 'off'].includes(norm)) return false;
    if (['sleeping'].includes(norm)) return true;
    return ['1', 'true', 'online', 'on-line', 'on', 'present', 'up', 'connected'].includes(norm);
  }
  return false;
}

export function normaliseDevice(raw: RawNetAlertXDevice, source: 'netalertx' | 'demo' = 'netalertx'): Device {
  const rawId = raw.id?.toString();
  const mac = normaliseMac(
    pickString(raw.dev_MAC, (raw as { devMAC?: string }).devMAC, raw.mac, raw.hwaddr),
  );
  const ip = pickString(raw.dev_LastIP, raw.devIP, raw.ip);
  const vendor = pickString(raw.dev_Vendor, raw.devVendor, raw.vendor);
  const deviceType = pickString(raw.dev_DeviceType, raw.devType, raw.type);
  const privateMac = isPrivateMac(mac);
  const fqdn = pickString(raw.devFQDN, raw.hostname);
  const name =
    pickMeaningfulString(
      raw.dev_Name,
      raw.devName,
      raw.name,
      fqdn,
      raw.hostname,
      vendor && vendor !== 'Unknown vendor' ? vendor : undefined,
      ip ? `${ip}` : undefined,
      mac ? mac : undefined,
    ) ||
    (privateMac ? 'Private MAC / Unknown Mobile Device' : ip ? `Client ${ip}` : mac ? `Device ${mac}` : 'Unknown Device');
  const firstSeen = parseDate(raw.dev_FirstConnection ?? raw.firstSeen);
  const lastSeen = parseDate(raw.dev_LastConnection ?? raw.lastSeen);
  const lastDisconnected = parseDate(raw.dev_LastDisconnect ?? raw.lastDisconnected);
  const isOnline = online(raw);
  const id = stableDeviceId(rawId, mac, ip);
  const isUnknown = /unknown/i.test(name) || (!vendor && !deviceType) || privateMac;
  return {
    id,
    name,
    displayName: privateMac && isUnknown ? 'Private MAC / Unknown Mobile Device' : name,
    ipAddress: ip,
    macAddress: mac,
    vendor,
    deviceType,
    status: isOnline ? 'online' : 'offline',
    isOnline,
    isKnown: !isUnknown,
    isNew: firstSeen ? Date.now() - new Date(firstSeen).getTime() < 24 * 60 * 60 * 1000 : false,
    isUnknown,
    isPrivateMac: privateMac,
    firstSeen,
    lastSeen,
    lastConnected: isOnline ? lastSeen : undefined,
    lastDisconnected,
    connectedDurationSeconds: isOnline ? secondsBetween(lastSeen) : undefined,
    source,
    rawNetAlertXId: rawId,
  };
}
