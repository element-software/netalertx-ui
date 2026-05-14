'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { renameDeviceRequestSchema } from '@/lib/validation/device-rename';
import { Button } from '@/components/ui/Button';

/**
 * Renames the device in NetAlertX via POST /device/{mac}/set-alias (same API port as GraphQL).
 * NetAlertX does not expose device rename as a GraphQL mutation.
 */
export function DeviceRenameForm({
  deviceId,
  initialDisplayName,
}: {
  deviceId: string;
  initialDisplayName: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialDisplayName);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldError(null);
    setFormError(null);

    const parsed = renameDeviceRequestSchema.safeParse({ displayName: value });
    if (!parsed.success) {
      const first = parsed.error.flatten().fieldErrors.displayName?.[0];
      setFieldError(first ?? 'Invalid name');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/devices/${encodeURIComponent(deviceId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        issues?: unknown;
        device?: { displayName?: string };
      };
      if (!res.ok) {
        if (res.status === 422 && data.issues) {
          const issues = data.issues as { fieldErrors?: { displayName?: string[] } };
          setFieldError(issues.fieldErrors?.displayName?.[0] ?? 'Invalid name');
          return;
        }
        setFormError(typeof data.error === 'string' ? data.error : 'Could not save name');
        return;
      }
      if (data.device?.displayName) setValue(data.device.displayName);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 rounded-2xl border border-white/10 bg-white/[.04] p-5">
      <h2 className="text-lg font-bold">Rename in NetAlertX</h2>
      <p className="mt-1 text-sm text-slate-400">
        Updates <code className="text-slate-300">devName</code> on your NetAlertX instance (REST{' '}
        <code className="text-slate-300">set-alias</code>, same server as GraphQL). Requires{' '}
        <code className="text-slate-300">NETALERTX_API_TOKEN</code>.
      </p>
      <label htmlFor="device-display-name" className="mt-4 block text-sm font-medium text-slate-300">
        Display name
      </label>
      <input
        id="device-display-name"
        name="displayName"
        value={value}
        onChange={(ev) => setValue(ev.target.value)}
        autoComplete="off"
        maxLength={120}
        className="mt-2 w-full max-w-xl rounded-xl border border-white/15 bg-slate-950/60 px-4 py-3 text-white outline-none ring-emerald-400/40 placeholder:text-slate-600 focus:ring-2"
        placeholder="e.g. Living room Apple TV"
      />
      {fieldError ? <p className="mt-2 text-sm text-rose-300">{fieldError}</p> : null}
      {formError ? <p className="mt-2 text-sm text-amber-200">{formError}</p> : null}
      <Button type="submit" className="mt-4" disabled={saving}>
        {saving ? 'Saving…' : 'Save to NetAlertX'}
      </Button>
    </form>
  );
}
