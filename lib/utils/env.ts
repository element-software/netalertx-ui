/** Strips `/docs` or `/graphql` so NETALERTX_BASE_URL can match the GraphQL docs URL. */
export function normalizeNetAlertXBaseUrl(url: string): string {
  if (!url) return '';
  let u = url.trim().replace(/\/+$/, '');
  const lower = u.toLowerCase();
  if (lower.endsWith('/docs')) u = u.slice(0, -'/docs'.length);
  else if (lower.endsWith('/graphql')) u = u.slice(0, -'/graphql'.length);
  return u.replace(/\/+$/, '');
}
export function getEnv() {
  const graphqlLimitRaw = process.env.NETALERTX_GRAPHQL_PAGE_LIMIT;
  const graphqlLimit = graphqlLimitRaw
    ? Number(graphqlLimitRaw)
    : 500;
  return {
    appName: process.env.APP_NAME || 'NetGlance',
    netalertxBaseUrl: normalizeNetAlertXBaseUrl(process.env.NETALERTX_BASE_URL || ''),
    netalertxApiToken: process.env.NETALERTX_API_TOKEN || '',
    /** Optional `devices(options)` status filter per NetAlertX GraphQL docs (e.g. my_devices, connected). Omit from env to leave unset. */
    netalertxGraphqlDeviceStatus: (process.env.NETALERTX_GRAPHQL_DEVICE_STATUS || '').trim() || undefined,
    /** Page size for GraphQL devices query (NetAlertX events/plugins docs allow up to 1000). */
    netalertxGraphqlPageLimit: Math.min(1000, Math.max(1, Number.isFinite(graphqlLimit) ? graphqlLimit : 500)),
    pollIntervalSeconds: Math.max(5, Number(process.env.POLL_INTERVAL_SECONDS || 30)),
    sqliteDbPath: process.env.SQLITE_DB_PATH || './data/netglance.sqlite',
    appBaseUrl: process.env.APP_BASE_URL || '',
    enableSoundAlerts: process.env.ENABLE_SOUND_ALERTS === 'true',
    demoMode: process.env.ENABLE_DEMO_MODE === 'true',
    haBaseUrl: (process.env.HA_BASE_URL || '').trim().replace(/\/+$/, ''),
    haApiToken: process.env.HA_API_TOKEN || '',
    z2mBaseUrl: (process.env.Z2M_BASE_URL || '').trim().replace(/\/+$/, ''),
  };
}
export function safeConfig() {
  const env = getEnv();
  let host = 'not configured';
  try { host = env.netalertxBaseUrl ? new URL(env.netalertxBaseUrl).host : host; } catch { host = 'invalid URL'; }
  let haHost: string | undefined;
  try { haHost = env.haBaseUrl ? new URL(env.haBaseUrl).host : undefined; } catch { haHost = 'invalid URL'; }
  let z2mHost: string | undefined;
  try { z2mHost = env.z2mBaseUrl ? new URL(env.z2mBaseUrl).host : undefined; } catch { z2mHost = 'invalid URL'; }
  return {
    appName: env.appName,
    netalertxHost: host,
    pollIntervalSeconds: env.pollIntervalSeconds,
    sqliteConfigured: Boolean(env.sqliteDbPath),
    demoMode: env.demoMode,
    soundAlertsEnabled: env.enableSoundAlerts,
    ...(haHost !== undefined && { homeAssistantHost: haHost }),
    ...(z2mHost !== undefined && { zigbee2mqttHost: z2mHost }),
  };
}
