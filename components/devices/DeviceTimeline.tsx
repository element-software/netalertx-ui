export function DeviceTimeline({ events }: { events: any[] }) {
  return (
    <div className="max-h-[min(52dvh,28rem)] touch-pan-y space-y-3 overflow-x-auto overflow-y-auto overscroll-contain pr-1 md:max-h-[min(60dvh,36rem)]">
      {events.map((e) => (
        <div key={e.id} className="rounded-2xl bg-white/[.04] p-3">
          <p className="break-words">{e.message}</p>
          <p className="text-xs text-slate-500">{new Date(e.at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
