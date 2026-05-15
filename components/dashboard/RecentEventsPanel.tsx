import { Card } from '@/components/ui/Card';

export function RecentEventsPanel({
  events,
  className = '',
}: {
  events: Array<{ id: string; message: string; at: string }>;
  className?: string;
}) {
  return (
    <Card className={`flex h-full min-h-0 flex-1 flex-col overflow-hidden ${className}`}>
      <div className="mb-3 flex shrink-0 items-baseline justify-between gap-2">
        <h2 className="text-xl font-bold">Recent events</h2>
        <span className="text-xs tabular-nums text-slate-500">{events.length} shown</span>
      </div>
      <div className="min-h-0 max-h-[min(52dvh,28rem)] flex-1 touch-pan-y space-y-3 overflow-x-auto overflow-y-auto overscroll-contain pr-1 xl:max-h-none">
        {events.map((e) => (
          <div
            key={e.id}
            className="rounded-2xl border border-white/5 bg-white/[.03] p-3"
          >
            <p className="break-words font-medium">{e.message}</p>
            <p className="text-xs text-slate-500">{new Date(e.at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
