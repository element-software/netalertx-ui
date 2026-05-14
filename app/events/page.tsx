import { recentEvents } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function EventsPage() {
  return (
    <div className="h-full overflow-y-auto overscroll-y-contain p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-5xl font-black">Recent events</h1>
        <div className="space-y-3">
          {recentEvents(100).map((e) => (
            <div
              key={e.id}
              className="rounded-3xl border border-white/10 bg-white/[.04] p-4"
            >
              <p className="font-bold">{e.message}</p>
              <p className="text-sm text-slate-500">
                {e.type} · {new Date(e.at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
