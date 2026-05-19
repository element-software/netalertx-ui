import { getEnv } from '@/lib/utils/env';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const { z2mBaseUrl } = getEnv();
  if (!z2mBaseUrl) return Response.json({ status: 'unconfigured' });

  try {
    const res = await fetch(`${z2mBaseUrl}/api`, {
      signal: AbortSignal.timeout(5000),
      cache: 'no-store',
    });
    return Response.json({ status: res.ok ? 'online' : 'offline' });
  } catch {
    return Response.json({ status: 'offline' });
  }
}
