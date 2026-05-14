'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/', label: 'Dashboard' },
  { href: '/devices', label: 'Devices' },
  { href: '/events', label: 'Events' },
  { href: '/settings', label: 'Settings' },
] as const;

function navActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex h-[100dvh] min-h-0 w-full overflow-hidden text-[var(--fg,#e5eefb)]">
      <aside
        className="flex w-[13.75rem] shrink-0 flex-col border-r border-white/10 bg-slate-950/80 py-5 pl-4 pr-3 backdrop-blur-xl"
        aria-label="Application"
      >
        <div className="mb-6 px-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Local network</p>
          <p className="mt-1 text-lg font-black tracking-tight text-white">NetGlance</p>
        </div>
        <nav className="flex flex-col gap-0.5" aria-label="Main navigation">
          {NAV.map(({ href, label }) => {
            const active = navActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={[
                  'rounded-r-xl border-l-2 py-2.5 pl-3 pr-2 text-sm transition-colors',
                  active
                    ? 'border-l-emerald-400 bg-white/[0.08] font-semibold text-white'
                    : 'border-l-transparent text-slate-400 hover:bg-white/[0.05] hover:text-slate-200',
                ].join(' ')}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  );
}
