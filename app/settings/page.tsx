import { safeConfig } from '@/lib/utils/env';
import { getState } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  const c = safeConfig();
  const rows = {
    ...c,
    lastSuccessfulUpdate: getState<string>('last_successful_update') ?? 'never',
    appVersion: '0.1.0',
  };
  return (
    <div className="h-full overflow-y-auto overscroll-y-contain p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-4xl font-black sm:text-5xl">Settings</h1>
        <div className="rounded-3xl border border-white/10 bg-white/[.04] p-5 sm:p-6">
          <div className="-mx-5 touch-pan-x overflow-x-auto overscroll-x-contain px-5 sm:-mx-6 sm:px-6">
            <dl className="grid min-w-max grid-cols-1 gap-4 sm:min-w-0 sm:grid-cols-2">
              {Object.entries(rows).map(([k, v]) => (
                <div key={k} className="min-w-[12rem] max-w-[36rem] rounded-2xl bg-black/20 p-4 sm:max-w-none">
                  <dt className="text-sm text-slate-500">{k}</dt>
                  <dd className="break-words font-semibold">{String(v)}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="mt-6 text-slate-300">
            Privacy note: NetGlance runs locally, stores data in local SQLite, and never sends NetAlertX
            credentials to the browser.
          </p>
        </div>
      </div>
    </div>
  );
}
