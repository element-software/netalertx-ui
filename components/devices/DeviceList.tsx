'use client';

import { useMemo, useState } from 'react';
import { DeviceListItem } from './DeviceListItem';

export function DeviceList({ devices }: { devices: any[] }) {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const rows = useMemo(
    () =>
      devices.filter(
        (d) =>
          (filter === 'all' ||
            (filter === 'online' && d.isOnline) ||
            (filter === 'unknown' && d.isUnknown) ||
            (filter === 'new' && d.isNew) ||
            (filter === 'disconnected' && !d.isOnline)) &&
          JSON.stringify(d).toLowerCase().includes(q.toLowerCase()),
      ),
    [devices, q, filter],
  );

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search devices"
          className="min-h-11 w-full min-w-0 shrink rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 outline-none sm:max-w-xl sm:flex-1"
        />
        <div className="flex flex-wrap gap-2 sm:max-w-full sm:justify-end">
          {(['all', 'online', 'unknown', 'new', 'disconnected'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`min-h-11 rounded-2xl px-3 py-2 text-sm capitalize sm:px-4 ${filter === f ? 'bg-cyan-300 text-slate-950' : 'bg-white/5'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="max-h-[min(75dvh,42rem)] touch-pan-y space-y-3 overflow-x-auto overflow-y-auto overscroll-contain pr-1">
        {rows.map((d) => (
          <DeviceListItem key={d.id} device={d} />
        ))}
      </div>
    </div>
  );
}
