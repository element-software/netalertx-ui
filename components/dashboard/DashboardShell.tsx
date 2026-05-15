'use client';

import { useEffect, useState } from 'react';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { AlertOverlay } from './AlertOverlay';
import { DashboardHeader } from './DashboardHeader';
import { LatestEventCard } from './LatestEventCard';
import { NetworkHealthCard } from './NetworkHealthCard';
import { OnlineDevicesPanel } from './OnlineDevicesPanel';
import { RecentEventsPanel } from './RecentEventsPanel';
import type { Device, NetAlertXEvent } from '@/lib/netalertx/types';
import { SummaryCards } from './SummaryCards';

export function DashboardShell() {
  const [summary, setSummary] = useState<Record<string, unknown>>();
  const [devices, setDevices] = useState<Device[]>([]);
  const [events, setEvents] = useState<NetAlertXEvent[]>([]);
  const [error, setError] = useState('');

  async function load() {
    const [s, d, e] = await Promise.all([
      fetch('/api/summary', { cache: 'no-store' }).then((r) => r.json()),
      fetch('/api/devices', { cache: 'no-store' }).then((r) => r.json()),
      fetch('/api/events/recent', { cache: 'no-store' }).then((r) => r.json()),
    ]);
    setSummary(s);
    setDevices(d.devices);
    setEvents(e.events);
  }

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        await load();
      } catch {
        if (!cancelled) setError('Unable to load dashboard');
      }
    })();
    const es = new EventSource('/api/stream');
    es.addEventListener('summary', (ev) => {
      const s = JSON.parse((ev as MessageEvent).data);
      setSummary(s);
      void fetch('/api/devices')
        .then((r) => r.json())
        .then((d) => setDevices(d.devices));
      void fetch('/api/events/recent')
        .then((r) => r.json())
        .then((e) => setEvents(e.events));
    });
    es.onerror = () => setError('Live stream disconnected; reconnecting automatically.');
    return () => {
      cancelled = true;
      es.close();
    };
  }, []);

  async function ack() {
    const alerts = summary?.alerts as { id: string }[] | undefined;
    if (!alerts?.[0]) return;
    await fetch(`/api/alerts/${encodeURIComponent(alerts[0].id)}/acknowledge`, { method: 'POST' });
    await load();
  }

  if (error && !summary) return <ErrorState message={error} />;
  if (!summary) return <LoadingState />;

  const alerts = summary.alerts as { id: string }[] | undefined;

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden p-4 sm:gap-5 sm:p-6 max-xl:overflow-y-auto max-xl:overscroll-y-contain">
      <DashboardHeader summary={summary} />
      <SummaryCards summary={summary} />
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden sm:gap-5 xl:grid-cols-[1.05fr_0.95fr] max-xl:flex-none max-xl:overflow-visible xl:min-h-0">
        <div className="flex min-h-0 min-w-0 flex-col gap-4 overflow-hidden sm:gap-5 max-xl:min-h-0">
          <div className="shrink-0">
            <LatestEventCard event={(summary as { latestEvent?: unknown }).latestEvent} />
          </div>
          <div className="shrink-0">
            <NetworkHealthCard summary={summary} />
          </div>
          <OnlineDevicesPanel
            devices={devices}
            className="min-h-[min(42dvh,22rem)] min-w-0 shrink-0 xl:min-h-0 xl:flex-1"
          />
        </div>
        <div className="flex min-h-0 min-w-0 flex-col overflow-hidden max-xl:min-h-[min(42dvh,22rem)] xl:min-h-0">
          <RecentEventsPanel events={events} className="h-full min-h-0 flex-1" />
        </div>
      </div>
      <AlertOverlay alert={alerts?.[0]} onAck={ack} />
    </div>
  );
}
