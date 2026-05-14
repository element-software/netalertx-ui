export const isoNow = () => new Date().toISOString();
export function parseDate(value: unknown) { if (!value) return undefined; const d = new Date(String(value)); return Number.isNaN(d.getTime()) ? undefined : d.toISOString(); }
export function isToday(iso?: string) { if (!iso) return false; const d = new Date(iso), n = new Date(); return d.getUTCFullYear()===n.getUTCFullYear() && d.getUTCMonth()===n.getUTCMonth() && d.getUTCDate()===n.getUTCDate(); }
