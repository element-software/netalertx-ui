'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';

type ServiceStatus = 'online' | 'offline' | 'connected' | 'disconnected' | 'unconfigured';

function ServiceChip({ label, status }: { label: string; status: ServiceStatus }) {
  if (status === 'unconfigured') return null;
  return (
    <Badge tone={status === 'online' || status === 'connected' ? 'green' : 'red'}>
      {label} {status}
    </Badge>
  );
}

export function DashboardHeader({
  summary,
  haStatus,
  z2mStatus,
}: {
  summary: any;
  haStatus?: ServiceStatus;
  z2mStatus?: ServiceStatus;
}) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <p className="text-sm uppercase tracking-[.45em] text-cyan-200/70">Local network</p>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">{summary.appName}</h1>
      </div>
      <div className="shrink-0 text-left sm:text-right">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <ServiceChip label="NetAlertX" status={summary.status} />
          <ServiceChip label="HA" status={haStatus ?? 'unconfigured'} />
          <ServiceChip label="Z2M" status={z2mStatus ?? 'unconfigured'} />
          {summary.demoMode && (
            <span className="rounded-full bg-violet-400/15 px-3 py-1 text-xs text-violet-100">
              DEMO MODE
            </span>
          )}
        </div>
        <p className="text-sm text-slate-400">
          Updated{' '}
          {summary.lastSuccessfulUpdate
            ? new Date(summary.lastSuccessfulUpdate).toLocaleTimeString()
            : 'never'}
        </p>
        <p className="text-2xl font-bold tabular-nums">
          {now.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </p>
      </div>
    </header>
  );
}
