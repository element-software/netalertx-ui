/** NetAlertX often leaves `devName` as a translation placeholder while FQDN / vendor / IP hold the real label. */
export function isPlaceholderDeviceName(value: string): boolean {
  const t = value.trim().toLowerCase();
  if (!t) return true;
  if (t.includes('name not found')) return true;
  if (t.includes('(unknown)') || t === '(unknown)') return true;
  if (t === 'unknown' || t === 'unknown device') return true;
  return false;
}

/** First trimmed string that is not an empty or placeholder name. */
export function pickMeaningfulString(...values: unknown[]): string | undefined {
  for (const v of values) {
    if (typeof v !== 'string') continue;
    const t = v.trim();
    if (!t || isPlaceholderDeviceName(t)) continue;
    return t;
  }
  return undefined;
}
