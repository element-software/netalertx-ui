import { describe, expect, it } from 'vitest';
import { renameDeviceRequestSchema } from '@/lib/validation/device-rename';

describe('renameDeviceRequestSchema', () => {
  it('accepts a trimmed non-empty name', () => {
    const r = renameDeviceRequestSchema.safeParse({ displayName: '  Living TV  ' });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.displayName).toBe('Living TV');
  });
  it('rejects empty after trim', () => {
    const r = renameDeviceRequestSchema.safeParse({ displayName: '   ' });
    expect(r.success).toBe(false);
  });
  it('rejects missing displayName', () => {
    const r = renameDeviceRequestSchema.safeParse({});
    expect(r.success).toBe(false);
  });
  it('rejects overly long names', () => {
    const r = renameDeviceRequestSchema.safeParse({ displayName: 'x'.repeat(121) });
    expect(r.success).toBe(false);
  });
});
