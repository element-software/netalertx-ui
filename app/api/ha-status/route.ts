import { getEnv } from '@/lib/utils/env';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const { haBaseUrl, haApiToken } = getEnv();
  if (!haBaseUrl) return Response.json({ status: 'unconfigured' });

  try {
    const res = await fetch(`${haBaseUrl}/api/`, {
      headers: haApiToken ? { Authorization: `Bearer ${haApiToken}` } : {},
      signal: AbortSignal.timeout(5000),
      cache: 'no-store',
    });
    return Response.json({ status: res.ok ? 'online' : 'offline' });
  } catch {
    return Response.json({ status: 'offline' });
  }
}
