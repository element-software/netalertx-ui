'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'netglance-sidebar-collapsed';

const NAV = [
  {
    href: '/',
    label: 'Dashboard',
    Icon: IconDashboard,
  },
  {
    href: '/devices',
    label: 'Devices',
    Icon: IconDevices,
  },
  {
    href: '/events',
    label: 'Events',
    Icon: IconEvents,
  },
  {
    href: '/settings',
    label: 'Settings',
    Icon: IconSettings,
  },
] as const;

function navActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [storedLoaded, setStoredLoaded] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(STORAGE_KEY) === '1');
    } catch {
      /* ignore */
    }
    setStoredLoaded(true);
  }, []);

  useEffect(() => {
    if (!storedLoaded) return;
    try {
      if (collapsed) localStorage.setItem(STORAGE_KEY, '1');
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, [collapsed, storedLoaded]);

  return (
    <div className="flex h-[100dvh] min-h-0 w-full overflow-hidden text-[var(--fg,#e5eefb)]">
      <aside
        className={[
          'flex shrink-0 flex-col border-r border-white/10 bg-slate-950/80 backdrop-blur-xl transition-[width,padding] duration-200 ease-out',
          collapsed ? 'w-14 py-4 pl-1.5 pr-1.5' : 'w-[13.75rem] py-5 pl-4 pr-3',
        ].join(' ')}
        aria-label="Application"
      >
        <div
          className={[
            'mb-4 flex min-h-[2.75rem] items-start gap-2',
            collapsed ? 'flex-col items-center px-0' : 'mb-6 px-2',
          ].join(' ')}
        >
          <div className={collapsed ? 'sr-only' : 'min-w-0 flex-1'}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Local network</p>
            <p className="mt-1 text-lg font-black tracking-tight text-white">NetGlance</p>
          </div>
          {collapsed && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] text-sm font-black text-white" aria-hidden>
              N
            </div>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className={[
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white',
              collapsed ? 'mx-auto' : 'mt-0.5',
            ].join(' ')}
            aria-expanded={!collapsed}
            aria-controls="app-main-nav"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span className="sr-only">{collapsed ? 'Expand sidebar' : 'Collapse sidebar'}</span>
            <svg
              className={['h-5 w-5 transition-transform duration-200', collapsed ? 'rotate-180' : ''].join(' ')}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        </div>
        <nav id="app-main-nav" className="flex flex-col gap-0.5" aria-label="Main navigation">
          {NAV.map(({ href, label, Icon }) => {
            const active = navActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={[
                  'flex items-center gap-3 rounded-r-xl border-l-2 py-2.5 text-sm transition-colors',
                  collapsed ? 'justify-center px-0' : 'pl-3 pr-2',
                  active
                    ? 'border-l-emerald-400 bg-white/[0.08] font-semibold text-white'
                    : 'border-l-transparent text-slate-400 hover:bg-white/[0.05] hover:text-slate-200',
                ].join(' ')}
              >
                <Icon className="h-[1.125rem] w-[1.125rem] shrink-0 opacity-90" aria-hidden />
                <span className={collapsed ? 'sr-only' : ''}>{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  );
}

function IconDashboard(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9 12 2l9 7" />
      <path d="M9 22V12h6v10" />
      <path d="M5 22h14" />
    </svg>
  );
}

function IconDevices(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="12" x="4" y="4" rx="2" />
      <path d="M8 20h8" />
      <path d="M12 16v4" />
    </svg>
  );
}

function IconEvents(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function IconSettings(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
