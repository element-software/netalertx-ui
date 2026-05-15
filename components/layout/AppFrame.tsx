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

  // localStorage is unavailable during SSR; apply the saved width after hydrate.
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage only after hydrate
        setCollapsed(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c;
      try {
        if (next) localStorage.setItem(STORAGE_KEY, '1');
        else localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return (
    <div className="flex h-[100dvh] min-h-0 w-full flex-col overflow-hidden text-[var(--fg,#e5eefb)] xl:flex-row">
      <aside
        className={[
          'flex border-white/10 bg-slate-950/80 backdrop-blur-xl transition-[width,padding] duration-200 ease-out',
          'order-2 shrink-0 flex-col border-t max-xl:w-full max-xl:flex-row max-xl:items-center max-xl:justify-between max-xl:gap-1 max-xl:px-2 max-xl:py-2 max-xl:pb-[max(0.5rem,env(safe-area-inset-bottom))] xl:order-none xl:flex-col xl:border-r xl:border-t-0',
          collapsed ? 'w-14 py-4 pl-1.5 pr-1.5 max-xl:w-full max-xl:py-2 max-xl:pl-2 max-xl:pr-2' : 'w-[13.75rem] py-5 pl-4 pr-3 max-xl:w-full max-xl:py-2 max-xl:px-2',
        ].join(' ')}
        aria-label="Application"
      >
        <div
          className={[
            'mb-4 flex min-h-[2.75rem] items-start gap-2 max-xl:hidden',
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
            onClick={toggleCollapsed}
            className={[
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white max-xl:hidden',
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
        <div className="hidden max-xl:flex max-xl:shrink-0 max-xl:items-center max-xl:justify-center max-xl:px-1" aria-hidden>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.08] text-sm font-black text-white">N</div>
        </div>
        <nav
          id="app-main-nav"
          className="flex max-xl:min-w-0 max-xl:flex-1 max-xl:flex-row max-xl:justify-evenly max-xl:gap-0.5 xl:flex-col xl:gap-0.5"
          aria-label="Main navigation"
        >
          {NAV.map(({ href, label, Icon }) => {
            const active = navActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={[
                  'flex items-center gap-3 rounded-r-xl border-l-2 py-2.5 text-sm transition-colors',
                  'max-xl:min-w-0 max-xl:flex-1 max-xl:flex-col max-xl:justify-center max-xl:gap-1 max-xl:rounded-xl max-xl:border-l-0 max-xl:border-t-2 max-xl:px-1 max-xl:py-2.5 max-xl:text-center max-xl:text-xs',
                  collapsed ? 'justify-center px-0 xl:justify-center' : 'pl-3 pr-2 max-xl:px-1',
                  active
                    ? 'max-xl:border-t-emerald-400 border-l-emerald-400 bg-white/[0.08] font-semibold text-white'
                    : 'max-xl:border-t-transparent border-l-transparent text-slate-400 hover:bg-white/[0.05] hover:text-slate-200',
                ].join(' ')}
              >
                <Icon className="h-[1.125rem] w-[1.125rem] shrink-0 opacity-90 max-xl:h-5 max-xl:w-5" aria-hidden />
                <span className={collapsed ? 'max-xl:inline xl:sr-only' : ''}>{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="order-1 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden pt-[env(safe-area-inset-top)] xl:order-none">
        {children}
      </div>
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
