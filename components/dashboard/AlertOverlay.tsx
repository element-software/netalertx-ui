'use client';

import { Button } from '@/components/ui/Button';

export function AlertOverlay({ alert, onAck }: { alert: any; onAck: () => void }) {
  if (!alert) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/85 p-4 backdrop-blur sm:p-8">
      <div className="max-h-[min(90dvh,calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)))] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-[2rem] border border-amber-300/30 bg-slate-900 p-5 shadow-2xl sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[.4em] text-amber-200 sm:text-sm">Alert</p>
        <h2 className="mt-3 text-2xl font-black sm:text-4xl">{alert.title}</h2>
        <p className="mt-4 text-base text-slate-200 sm:text-xl">{alert.message}</p>
        <pre className="mt-5 overflow-auto rounded-2xl bg-black/30 p-3 text-xs text-slate-300 sm:p-4 sm:text-sm">
          {JSON.stringify(alert.payload, null, 2)}
        </pre>
        <Button className="mt-6 w-full min-h-11 sm:w-auto" onClick={onAck}>
          Acknowledge
        </Button>
      </div>
    </div>
  );
}
