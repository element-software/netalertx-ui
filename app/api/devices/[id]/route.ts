import { getDevice, recentEvents, updateDeviceRecord } from '@/lib/db';
import { getEnv } from '@/lib/utils/env';
import { setNetAlertXDeviceAlias } from '@/lib/netalertx/netalertx-device-api';
import { renameDeviceRequestSchema } from '@/lib/validation/device-rename';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const idPattern = /^[\w:.-]+$/;

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!idPattern.test(id)) return Response.json({ error: 'Invalid device id' }, { status: 400 });
  const device = getDevice(id);
  if (!device) return Response.json({ error: 'Device not found' }, { status: 404 });
  const events = recentEvents(100).filter((e) => e.deviceId === id);
  return Response.json({ device, events }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!idPattern.test(id)) return Response.json({ error: 'Invalid device id' }, { status: 400 });

  const env = getEnv();
  if (env.demoMode) {
    return Response.json({ error: 'Rename is disabled in demo mode' }, { status: 400 });
  }
  if (!env.netalertxBaseUrl) {
    return Response.json({ error: 'NETALERTX_BASE_URL is not configured' }, { status: 503 });
  }
  if (!env.netalertxApiToken?.trim()) {
    return Response.json(
      { error: 'NETALERTX_API_TOKEN is required to rename devices in NetAlertX' },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = renameDeviceRequestSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { error: 'Validation failed', issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const device = getDevice(id);
  if (!device) return Response.json({ error: 'Device not found' }, { status: 404 });

  const mac = device.macAddress?.trim();
  if (!mac) {
    return Response.json(
      { error: 'This device has no MAC address; NetAlertX rename requires a MAC' },
      { status: 400 },
    );
  }

  try {
    await setNetAlertXDeviceAlias(
      env.netalertxBaseUrl,
      env.netalertxApiToken,
      mac,
      parsed.data.displayName,
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : 'NetAlertX request failed';
    return Response.json({ error: message }, { status: 502 });
  }

  const displayName = parsed.data.displayName;
  updateDeviceRecord(id, { displayName, name: displayName });

  return Response.json({ device: getDevice(id) }, { headers: { 'Cache-Control': 'no-store' } });
}
