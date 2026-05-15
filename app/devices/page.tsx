import { getDevices } from '@/lib/db';
import { DeviceList } from '@/components/devices/DeviceList';

export const dynamic = 'force-dynamic';

export default function DevicesPage() {
  return (
    <div className="h-full overflow-y-auto overscroll-y-contain p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-5 text-4xl font-black sm:mb-6 sm:text-5xl">Devices</h1>
        <DeviceList devices={getDevices()} />
      </div>
    </div>
  );
}
