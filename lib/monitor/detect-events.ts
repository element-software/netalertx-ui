import { makeEvent } from '@/lib/netalertx/normalise-event';
import type { Device, NetAlertXEvent } from '@/lib/netalertx/types';

/** When there is no prior snapshot, we only persist the current device list — no synthetic join/first-seen storm. */
export function detectEvents(previous: Device[], current: Device[]): NetAlertXEvent[] {
  const prev = new Map(previous.map((d) => [d.id, d]));
  const events: NetAlertXEvent[] = [];
  const baseline = previous.length === 0;

  for (const device of current) {
    const old = prev.get(device.id);
    if (!old) {
      if (!baseline) {
        events.push(
          makeEvent(
            'device_first_seen',
            `${device.displayName} was first seen`,
            device.id,
            device.displayName,
            device.isUnknown ? 'warning' : 'info',
          ),
        );
        if (device.isOnline) {
          events.push(
            makeEvent(
              'device_joined',
              `${device.displayName} joined the network`,
              device.id,
              device.displayName,
              device.isUnknown ? 'warning' : 'info',
            ),
          );
        }
      }
      continue;
    }
    if (!old.isOnline && device.isOnline) {
      events.push(makeEvent('device_reconnected', `${device.displayName} reconnected`, device.id, device.displayName));
    }
    if (old.isOnline && !device.isOnline) {
      events.push(makeEvent('device_disconnected', `${device.displayName} disconnected`, device.id, device.displayName));
    }
    if (old.status !== device.status) {
      events.push(
        makeEvent('device_status_changed', `${device.displayName} changed status to ${device.status}`, device.id, device.displayName),
      );
    }
  }
  return events;
}
