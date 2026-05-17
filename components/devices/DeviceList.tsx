'use client';

import { useMemo, useState } from 'react';
import { DeviceIcon } from '@/components/dashboard/DeviceIcon';
import { Badge } from '@/components/ui/Badge';
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable';
import type { Device } from '@/lib/netalertx/types';
import { formatDuration } from '@/lib/utils/duration';

/** Concatenate searchable tokens so one query can match any stored device field. */
function deviceSearchHaystack(d: Device): string {
  const mac = d.macAddress ?? '';
  const macCompact = mac.replace(/[^a-fA-F0-9]/gi, '');
  const pieces = [
    d.id,
    d.rawNetAlertXId,
    d.name,
    d.displayName,
    d.ipAddress,
    mac,
    macCompact,
    d.vendor,
    d.owner,
    d.group,
    d.location,
    d.staticIp === true ? 'static ip' : '',
    d.staticIp === false ? 'dynamic dhcp' : '',
    d.deviceType,
    d.status,
    d.isOnline ? 'online connected up on-line' : 'offline disconnected down off-line',
    formatDuration(d.connectedDurationSeconds),
    d.connectedDurationSeconds != null ? String(d.connectedDurationSeconds) : '',
    d.firstSeen,
    d.lastSeen,
    d.lastConnected,
    d.lastDisconnected,
    d.isNew ? 'new' : '',
    d.isUnknown || !d.isKnown ? 'unknown' : '',
    d.isPrivateMac ? 'private mac' : '',
    d.source,
  ];
  return pieces
    .filter((x) => x != null && String(x).trim() !== '')
    .map(String)
    .join(' ');
}

const DEVICE_COLUMNS: DataTableColumn<Device>[] = [
  {
    id: 'icon',
    header: '',
    getValue: (d) => d.deviceType ?? '',
    render: (d) => <DeviceIcon type={d.deviceType} online={d.isOnline} />,
    className: 'w-[4.5rem]',
    headerClassName: 'w-[4.5rem]',
  },
  {
    id: 'name',
    header: 'Name',
    getValue: (d) => d.displayName,
    render: (d) => <span className="font-bold text-slate-100">{d.displayName}</span>,
  },
  {
    id: 'ip',
    header: 'IP address',
    getValue: (d) => d.ipAddress ?? '',
    render: (d) =>
      d.ipAddress ? (
        <a
          href={`http://${d.ipAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="tabular-nums text-blue-400 hover:text-blue-300 hover:underline decoration-blue-600"
        >
          {d.ipAddress}
        </a>
      ) : (
        <span className="tabular-nums text-slate-500">No IP</span>
      ),
  },
  {
    id: 'mac',
    header: 'MAC address',
    getValue: (d) => d.macAddress ?? '',
    render: (d) => (
      <span className="font-mono text-xs tracking-tight text-slate-400">{d.macAddress ?? 'No MAC'}</span>
    ),
  },
  {
    id: 'vendor',
    header: 'Vendor',
    getValue: (d) => d.vendor ?? '',
    render: (d) => <span className="text-slate-300">{d.vendor ?? 'Unknown vendor'}</span>,
  },
  {
    id: 'group',
    header: 'Group',
    getValue: (d) => d.group ?? '',
    render: (d) => <span className="text-slate-300">{d.group ?? '—'}</span>,
  },
  {
    id: 'location',
    header: 'Location',
    getValue: (d) => d.location ?? '',
    render: (d) => <span className="text-slate-300">{d.location ?? '—'}</span>,
  },
  {
    id: 'staticIp',
    header: 'Static IP',
    getValue: (d) => (d.staticIp === true ? 'yes' : d.staticIp === false ? 'no' : ''),
    getFilterText: (d) =>
      d.staticIp === true ? 'yes static' : d.staticIp === false ? 'no dhcp dynamic' : '',
    render: (d) =>
      d.staticIp === true ? (
        <span className="text-slate-300">Yes</span>
      ) : d.staticIp === false ? (
        <span className="text-slate-500">No</span>
      ) : (
        <span className="text-slate-600">—</span>
      ),
  },
  {
    id: 'status',
    header: 'Status',
    getValue: (d) => d.status,
    getFilterText: (d) => `${d.status} ${d.isOnline ? 'online' : 'offline'}`,
    render: (d) => <Badge tone={d.isOnline ? 'green' : 'slate'}>{d.status}</Badge>,
    className: 'text-right',
    headerClassName: 'text-right',
  },
  {
    id: 'lastSeen',
    header: 'Last seen',
    getValue: (d) => (d.isOnline ? d.connectedDurationSeconds ?? 0 : null),
    getFilterText: (d) =>
      [
        formatDuration(d.connectedDurationSeconds),
        d.connectedDurationSeconds != null ? String(d.connectedDurationSeconds) : '',
        d.lastSeen ?? '',
      ]
        .join(' ')
        .trim(),
    render: (d) => (
      <span className="tabular-nums text-slate-400">{formatDuration(d.connectedDurationSeconds)}</span>
    ),
    className: 'text-right',
    headerClassName: 'text-right',
  },
];

export function DeviceList({ devices }: { devices: Device[] }) {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');

  const chipFiltered = useMemo(
    () =>
      devices.filter(
        (d) =>
          filter === 'all' ||
          (filter === 'online' && d.isOnline) ||
          (filter === 'unknown' && d.isUnknown) ||
          (filter === 'new' && d.isNew) ||
          (filter === 'disconnected' && !d.isOnline),
      ),
    [devices, filter],
  );

  const emptyMessage =
    devices.length === 0
      ? 'No devices stored yet.'
      : chipFiltered.length === 0
        ? 'No devices match these filters.'
        : 'No devices match your search.';

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          type="search"
          placeholder="Search by any field…"
          title="Matches name, IDs, IP, MAC (with or without separators), vendor, owner, group, location, static IP, device type, status, timestamps, connection duration, and flags such as new or unknown."
          autoComplete="off"
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
      <DataTable
        rows={chipFiltered}
        columns={DEVICE_COLUMNS}
        getRowKey={(d) => d.id}
        getRowHref={(d) => `/devices/${encodeURIComponent(d.id)}`}
        getRowAriaLabel={(d) => `Open device ${d.displayName}`}
        globalFilter={q}
        getRowSearchText={deviceSearchHaystack}
        initialSort={{ columnId: 'name', dir: 'asc' }}
        emptyMessage={emptyMessage}
      />
    </div>
  );
}
