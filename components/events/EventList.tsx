'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable';
import type { NetAlertXEvent } from '@/lib/netalertx/types';

function severityTone(s: NetAlertXEvent['severity']) {
  if (s === 'critical') return 'red';
  if (s === 'warning') return 'amber';
  return 'blue';
}

function formatEventAt(iso: string) {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return iso;
  return new Date(iso).toLocaleString();
}

/** Tokens for the events search box (matches every stored field). */
function eventSearchHaystack(e: NetAlertXEvent): string {
  const atMs = new Date(e.at).getTime();
  const typeReadable = e.type.replace(/_/g, ' ');
  const pieces = [
    e.id,
    e.type,
    typeReadable,
    e.deviceId,
    e.deviceName,
    e.message,
    e.at,
    Number.isFinite(atMs) ? String(atMs) : '',
    formatEventAt(e.at),
    e.severity,
    e.severity === 'info' ? 'information' : '',
    e.severity === 'warning' ? 'warn' : '',
    e.severity === 'critical' ? 'error fatal' : '',
  ];
  return pieces
    .filter((x) => x != null && String(x).trim() !== '')
    .map(String)
    .join(' ');
}

const EVENT_COLUMNS: DataTableColumn<NetAlertXEvent>[] = [
  {
    id: 'at',
    header: 'Time',
    getValue: (e) => {
      const t = new Date(e.at).getTime();
      return Number.isFinite(t) ? t : e.at;
    },
    render: (e) => (
      <span className="whitespace-nowrap tabular-nums text-slate-300">{formatEventAt(e.at)}</span>
    ),
    className: 'whitespace-nowrap align-top',
  },
  {
    id: 'severity',
    header: 'Severity',
    getValue: (e) => e.severity,
    render: (e) => <Badge tone={severityTone(e.severity)}>{e.severity}</Badge>,
    className: 'text-center align-top',
    headerClassName: 'text-center',
  },
  {
    id: 'type',
    header: 'Type',
    getValue: (e) => e.type,
    render: (e) => <span className="capitalize text-slate-200">{e.type.replace(/_/g, ' ')}</span>,
    className: 'align-top',
  },
  {
    id: 'device',
    header: 'Device',
    getValue: (e) => e.deviceName ?? e.deviceId ?? '',
    render: (e) => (
      <span className="break-words text-slate-300">{e.deviceName ?? e.deviceId ?? '—'}</span>
    ),
    className: 'max-w-[12rem] align-top',
  },
  {
    id: 'message',
    header: 'Message',
    getValue: (e) => e.message,
    render: (e) => <span className="break-words font-medium text-slate-100">{e.message}</span>,
    className: 'min-w-[12rem] align-top',
  },
];

export function EventList({ events }: { events: NetAlertXEvent[] }) {
  const [q, setQ] = useState('');

  const emptyMessage =
    events.length === 0 ? 'No events recorded yet.' : 'No events match your search.';

  return (
    <div>
      <div className="mb-5">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          type="search"
          placeholder="Search by any field…"
          title="Matches time, severity, event type, device id/name, message, and raw ids."
          autoComplete="off"
          className="min-h-11 w-full min-w-0 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 outline-none sm:max-w-xl"
        />
      </div>
      <DataTable
        rows={events}
        columns={EVENT_COLUMNS}
        getRowKey={(e) => e.id}
        getRowHref={(e) => (e.deviceId ? `/devices/${encodeURIComponent(e.deviceId)}` : undefined)}
        getRowAriaLabel={(e) =>
          e.deviceId ? `Open device ${e.deviceName ?? e.deviceId}` : `Event: ${e.message}`
        }
        globalFilter={q}
        getRowSearchText={eventSearchHaystack}
        initialSort={{ columnId: 'at', dir: 'desc' }}
        emptyMessage={emptyMessage}
        tableClassName="min-w-[720px]"
      />
    </div>
  );
}
