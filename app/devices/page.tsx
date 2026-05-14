import { getDevices } from '@/lib/db';
import { DeviceList } from '@/components/devices/DeviceList';

export const dynamic = 'force-dynamic';

export default function DevicesPage() {
  return (
    <div className="h-full overflow-y-auto overscroll-y-contain p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-5xl font-black">Devices</h1>
        <DeviceList devices={getDevices()} />
      </div>
    </div>
  );
}
