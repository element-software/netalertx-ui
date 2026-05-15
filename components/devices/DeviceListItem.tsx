import { DeviceIcon } from '@/components/dashboard/DeviceIcon';
import { Badge } from '@/components/ui/Badge';
import { formatDuration } from '@/lib/utils/duration';

export function DeviceListItem({ device }: { device: any }) {
  return (
    <a
      href={`/devices/${encodeURIComponent(device.id)}`}
      className="flex min-w-0 max-w-full items-center gap-4 overflow-x-auto rounded-3xl border border-white/10 bg-white/[.04] p-4 touch-pan-x overscroll-x-contain"
    >
      <DeviceIcon type={device.deviceType} online={device.isOnline} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-bold">{device.displayName}</p>
        <p className="whitespace-normal break-all text-sm text-slate-400 sm:break-words">
          {device.ipAddress ?? 'No IP'} · {device.macAddress ?? 'No MAC'} · {device.vendor ?? 'Unknown vendor'}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <Badge tone={device.isOnline ? 'green' : 'slate'}>{device.status}</Badge>
        <span className="tabular-nums text-sm text-slate-400">{formatDuration(device.connectedDurationSeconds)}</span>
      </div>
    </a>
  );
}
