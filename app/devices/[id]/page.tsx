import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDevice, recentEvents } from '@/lib/db';
import { DeviceDetailPanel } from '@/components/devices/DeviceDetailPanel';

export const dynamic = 'force-dynamic';

export default async function DevicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const device = getDevice(id);
  if (!device) notFound();
  return (
    <div className="h-full overflow-y-auto overscroll-y-contain p-6">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/devices"
          className="text-sm text-slate-400 transition-colors hover:text-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400/80"
        >
          ← Devices
        </Link>
        <div className="mt-4">
          <DeviceDetailPanel
            device={device}
            events={recentEvents(100).filter((e) => e.deviceId === id)}
          />
        </div>
      </div>
    </div>
  );
}
