import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { DeviceRenameForm } from '@/components/devices/DeviceRenameForm';
import { DeviceTimeline } from '@/components/devices/DeviceTimeline';
import { formatDuration } from '@/lib/utils/duration';
import type { Device, NetAlertXEvent } from '@/lib/netalertx/types';

export function DeviceDetailPanel({
  device,
  events,
}: {
  device: Device;
  events: NetAlertXEvent[];
}) {
  const rows: [string, string | undefined][] = [
    ['IP address', device.ipAddress],
    ['MAC address', device.macAddress],
    ['Vendor', device.vendor],
    ['Type', device.deviceType],
    ['First seen', device.firstSeen ? new Date(device.firstSeen).toLocaleString() : undefined],
    ['Last seen', device.lastSeen ? new Date(device.lastSeen).toLocaleString() : undefined],
    [
      'Last connected',
      device.lastConnected ? new Date(device.lastConnected).toLocaleString() : undefined,
    ],
    [
      'Last disconnected',
      device.lastDisconnected ? new Date(device.lastDisconnected).toLocaleString() : undefined,
    ],
    ['Connected duration', formatDuration(device.connectedDurationSeconds)],
  ];

  return (
    <Card className="p-5 md:p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-4xl font-black tracking-tight">{device.displayName}</h1>
          {device.isPrivateMac ? (
            <p className="mt-2 text-sm text-slate-400">
              Private/randomised MAC detected locally.
            </p>
          ) : null}
        </div>
        <Badge tone={device.isOnline ? 'green' : 'slate'}>{device.status}</Badge>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k} className="rounded-2xl bg-white/[.04] p-4">
            <dt className="text-sm text-slate-500">{k}</dt>
            <dd className="font-semibold">{v || '—'}</dd>
          </div>
        ))}
      </dl>

      <DeviceRenameForm
        key={`${device.id}-${device.displayName}`}
        deviceId={device.id}
        initialDisplayName={device.displayName}
      />

      <h2 className="mb-3 mt-8 text-2xl font-bold">Timeline</h2>
      <DeviceTimeline events={events} />
    </Card>
  );
}
