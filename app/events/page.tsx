import { recentEvents } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function EventsPage() {
  return (
    <div className="h-full overflow-y-auto overscroll-y-contain p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-5 text-4xl font-black sm:mb-6 sm:text-5xl">Recent events</h1>
        <div className="max-h-[min(75dvh,42rem)] touch-pan-y space-y-3 overflow-x-auto overflow-y-auto overscroll-contain pr-1">
          {recentEvents(100).map((e) => (
            <div
              key={e.id}
              className="rounded-3xl border border-white/10 bg-white/[.04] p-4"
            >
              <p className="break-words font-bold">{e.message}</p>
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
