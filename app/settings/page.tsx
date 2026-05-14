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
    <div className="h-full overflow-y-auto overscroll-y-contain p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-5xl font-black">Settings</h1>
        <div className="rounded-3xl border border-white/10 bg-white/[.04] p-6">
          <dl className="grid grid-cols-2 gap-4">
            {Object.entries(rows).map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-black/20 p-4">
                <dt className="text-sm text-slate-500">{k}</dt>
                <dd className="font-semibold">{String(v)}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-slate-300">
            Privacy note: NetGlance runs locally, stores data in local SQLite, and never sends NetAlertX
            credentials to the browser.
          </p>
        </div>
      </div>
    </div>
  );
}
