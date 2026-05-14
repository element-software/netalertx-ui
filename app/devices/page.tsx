import { getDevices } from '@/lib/db';import { DeviceList } from '@/components/devices/DeviceList';
export const dynamic='force-dynamic';
export default function DevicesPage(){return <main className="min-h-screen p-6"><div className="mx-auto max-w-6xl"><a className="text-slate-400" href="/">← Dashboard</a><h1 className="mb-6 mt-3 text-5xl font-black">Devices</h1><DeviceList devices={getDevices()}/></div></main>}
