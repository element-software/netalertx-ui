import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { DeviceIcon } from './DeviceIcon';

export function OnlineDevicesPanel({
  devices,
  className = '',
}: {
  devices: Array<{
    id: string;
    displayName: string;
    deviceType?: string;
    isOnline?: boolean;
    ipAddress?: string;
    vendor?: string;
  }>;
  className?: string;
}) {
  const online = devices.filter((d) => d.isOnline);
  return (
    <Card className={`flex min-h-0 flex-1 flex-col overflow-hidden ${className}`}>
      <div className="mb-3 flex shrink-0 items-baseline justify-between gap-2">
        <h2 className="text-xl font-bold">Online devices</h2>
        <span className="text-xs tabular-nums text-slate-500">{online.length} online</span>
      </div>
      <div className="min-h-0 max-h-[min(52dvh,28rem)] flex-1 touch-pan-y space-y-3 overflow-x-auto overflow-y-auto overscroll-contain pr-1 xl:max-h-none">
        {online.map((d) => (
          <Link
            href={`/devices/${encodeURIComponent(d.id)}`}
            key={d.id}
            className="flex min-w-0 max-w-full items-center gap-3 rounded-2xl bg-white/[.04] p-3 transition-colors hover:bg-white/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400/80"
          >
            <DeviceIcon type={d.deviceType} online={d.isOnline} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{d.displayName}</p>
              <p className="whitespace-normal break-all text-sm text-slate-400 sm:break-words">
                {d.ipAddress ?? 'No IP'} · {d.vendor ?? 'Unknown vendor'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
