/**
 * NetAlertX device writes: the GraphQL `devices` schema is read-only
 * (<https://github.com/netalertx/NetAlertX/blob/main/docs/API_GRAPHQL.md>).
 * Renames use the REST API on the same host/port as GraphQL (<https://github.com/netalertx/NetAlertX/blob/main/docs/API_DEVICE.md>).
 */
export async function setNetAlertXDeviceAlias(
  baseUrl: string,
  apiToken: string,
  macAddress: string,
  alias: string,
): Promise<void> {
  const root = baseUrl.replace(/\/$/, '');
  const mac = macAddress.trim();
  if (!mac) throw new Error('MAC address is required');
  const url = `${root}/device/${encodeURIComponent(mac)}/set-alias`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (apiToken) headers.Authorization = `Bearer ${apiToken}`;
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ alias }),
    cache: 'no-store',
  });
  const rawText = await res.text();
  let body: { success?: boolean; message?: string } = {};
  try {
    if (rawText) body = JSON.parse(rawText) as { success?: boolean; message?: string };
  } catch {
    if (!res.ok) throw new Error(`NetAlertX returned ${res.status}: ${rawText.slice(0, 200)}`);
  }
  if (!res.ok || body.success === false) {
    const msg = body.message || rawText?.slice(0, 200) || `NetAlertX returned ${res.status}`;
    throw new Error(msg);
  }
}
