'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState, type KeyboardEvent, type ReactNode } from 'react';

export type SortDir = 'asc' | 'desc';

export type DataTableColumn<T> = {
  id: string;
  header: ReactNode;
  /**
   * Plain value for sorting. Numbers and strings are compared intelligently.
   * When omitted, the column is not sortable unless `sortable` is explicitly false for decoration-only cells.
   */
  getValue?: (row: T) => string | number | boolean | null | undefined;
  /** Cell contents; defaults to stringifying `getValue` */
  render?: (row: T) => ReactNode;
  /** Default: true when `getValue` is defined */
  sortable?: boolean;
  /** Default: true when `getValue` or `getFilterText` contributes */
  filterable?: boolean;
  /** Extra text to match against `globalFilter` (e.g. formatted duration + raw seconds) */
  getFilterText?: (row: T) => string;
  className?: string;
  headerClassName?: string;
};

export type DataTableProps<T> = {
  rows: T[];
  columns: DataTableColumn<T>[];
  getRowKey: (row: T, index: number) => string;
  /** When set, rows navigate on click / Enter / Space */
  getRowHref?: (row: T) => string | undefined;
  /** Accessible name when `getRowHref` is used */
  getRowAriaLabel?: (row: T) => string;
  /**
   * Case-insensitive substring match. When `getRowSearchText` is set, the query is matched against
   * that string only; otherwise each filterable column contributes separately (joined values still
   * match with the same rules).
   */
  globalFilter?: string;
  /** Full searchable text per row (preferred when you need every field / derived tokens in one place). */
  getRowSearchText?: (row: T) => string;
  /** Initial sort applied before user interaction */
  initialSort?: { columnId: string; dir: SortDir };
  emptyMessage?: string;
  className?: string;
  tableClassName?: string;
};

function isSortable<T>(col: DataTableColumn<T>) {
  return col.sortable ?? col.getValue !== undefined;
}

function isFilterable<T>(col: DataTableColumn<T>) {
  if (col.filterable === false) return false;
  return col.getFilterText !== undefined || col.getValue !== undefined;
}

function compareSortValues(a: unknown, b: unknown): number {
  const empty = (x: unknown) => x === null || x === undefined || x === '';
  if (empty(a) && empty(b)) return 0;
  if (empty(a)) return 1;
  if (empty(b)) return -1;
  if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b);
  if (typeof a === 'number' && typeof b === 'number' && Number.isFinite(a) && Number.isFinite(b)) {
    return a - b;
  }
  const sa = String(a).toLowerCase();
  const sb = String(b).toLowerCase();
  return sa.localeCompare(sb, undefined, { numeric: true, sensitivity: 'base' });
}

/** Matches substring (case-insensitive). If that misses, compares alphanumeric-only forms (helps MACs without separators). */
function textMatchesQuery(haystack: string, query: string): boolean {
  const q = query.trim();
  if (!q) return true;
  const ql = q.toLowerCase();
  const h = haystack.toLowerCase();
  if (h.includes(ql)) return true;
  const qCompact = ql.replace(/[^a-z0-9]/g, '');
  if (qCompact.length < 2) return false;
  const hCompact = h.replace(/[^a-z0-9]/g, '');
  return hCompact.includes(qCompact);
}

function rowMatchesGlobalFilter<T>(
  row: T,
  columns: DataTableColumn<T>[],
  query: string,
  getRowSearchText?: (row: T) => string,
) {
  const q = query.trim();
  if (!q) return true;
  if (getRowSearchText) return textMatchesQuery(getRowSearchText(row), q);
  return columns.some((col) => {
    if (!isFilterable(col)) return false;
    const raw = col.getFilterText
      ? col.getFilterText(row)
      : col.getValue != null
        ? String(col.getValue(row))
        : '';
    return textMatchesQuery(raw, q);
  });
}

export function DataTable<T>({
  rows,
  columns,
  getRowKey,
  getRowHref,
  getRowAriaLabel,
  globalFilter = '',
  getRowSearchText,
  initialSort,
  emptyMessage = 'No rows to display.',
  className = '',
  tableClassName = '',
}: DataTableProps<T>) {
  const router = useRouter();
  const [sort, setSort] = useState<{ columnId: string; dir: SortDir } | null>(initialSort ?? null);

  const filteredRows = useMemo(
    () => rows.filter((row) => rowMatchesGlobalFilter(row, columns, globalFilter, getRowSearchText)),
    [rows, columns, globalFilter, getRowSearchText],
  );

  const sortedRows = useMemo(() => {
    if (!sort) return filteredRows;
    const col = columns.find((c) => c.id === sort.columnId);
    if (!col?.getValue || !isSortable(col)) return filteredRows;
    const mul = sort.dir === 'asc' ? 1 : -1;
    return [...filteredRows].sort((a, b) => mul * compareSortValues(col.getValue!(a), col.getValue!(b)));
  }, [filteredRows, sort, columns]);

  const toggleSort = (columnId: string) => {
    const col = columns.find((c) => c.id === columnId);
    if (!col?.getValue || !isSortable(col)) return;
    setSort((prev) => {
      if (!prev || prev.columnId !== columnId) return { columnId, dir: 'asc' };
      if (prev.dir === 'asc') return { columnId, dir: 'desc' };
      return null;
    });
  };

  const headerAriaSort = (columnId: string): 'ascending' | 'descending' | 'none' => {
    if (!sort || sort.columnId !== columnId) return 'none';
    return sort.dir === 'asc' ? 'ascending' : 'descending';
  };

  return (
    <div className={`overflow-hidden rounded-3xl border border-white/10 bg-white/[.04] ${className}`}>
      <div className="max-h-[min(75dvh,42rem)] touch-pan-y overflow-x-auto overflow-y-auto overscroll-contain">
        <table className={`w-full min-w-[640px] border-collapse text-left text-sm ${tableClassName}`}>
          <thead className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/95 backdrop-blur-md">
            <tr>
              {columns.map((col) => {
                const canSort = isSortable(col) && col.getValue !== undefined;
                const active = sort?.columnId === col.id;
                return (
                  <th
                    key={col.id}
                    scope="col"
                    aria-sort={canSort ? headerAriaSort(col.id) : undefined}
                    className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 ${col.headerClassName ?? ''} ${canSort ? 'cursor-pointer select-none hover:text-slate-200' : ''}`}
                  >
                    {canSort ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-left text-inherit"
                        aria-label={`Sort by ${typeof col.header === 'string' && col.header.trim() ? col.header : col.id}`}
                        onClick={() => toggleSort(col.id)}
                      >
                        <span>{col.header}</span>
                        <span className="tabular-nums text-[10px] font-normal text-slate-500" aria-hidden>
                          {active ? (sort!.dir === 'asc' ? '▲' : '▼') : '◇'}
                        </span>
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedRows.map((row, index) => {
                const href = getRowHref?.(row);
                const clickable = Boolean(href);

                const go = () => {
                  if (href) router.push(href);
                };

                const onRowKeyDown = (e: KeyboardEvent<HTMLTableRowElement>) => {
                  if (!clickable) return;
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    go();
                  }
                };

                return (
                  <tr
                    key={getRowKey(row, index)}
                    tabIndex={clickable ? 0 : undefined}
                    role={clickable ? 'link' : undefined}
                    aria-label={clickable && getRowAriaLabel ? getRowAriaLabel(row) : undefined}
                    onClick={clickable ? go : undefined}
                    onKeyDown={onRowKeyDown}
                    className={`border-b border-white/[0.06] transition-colors last:border-b-0 ${clickable ? 'cursor-pointer hover:bg-white/[0.06] focus-visible:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-emerald-400/70' : ''}`}
                  >
                    {columns.map((col) => (
                      <td key={col.id} className={`px-4 py-3 align-middle ${col.className ?? ''}`}>
                        {col.render?.(row) ??
                          (col.getValue !== undefined ? String(col.getValue(row) ?? '—') : null)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
