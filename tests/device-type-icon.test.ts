import { describe, expect, it } from 'vitest';
import { getDeviceTypeIconGlyph } from '@/lib/utils/device-type-icon';

describe('getDeviceTypeIconGlyph', () => {
  it('returns default for missing type', () => {
    expect(getDeviceTypeIconGlyph(undefined)).toBe('●');
    expect(getDeviceTypeIconGlyph('')).toBe('●');
    expect(getDeviceTypeIconGlyph('   ')).toBe('●');
  });

  it('matches infrastructure types', () => {
    expect(getDeviceTypeIconGlyph('Router')).toBe('◈');
    expect(getDeviceTypeIconGlyph('Core Gateway')).toBe('◈');
    expect(getDeviceTypeIconGlyph('Firewall')).toBe('◆');
    expect(getDeviceTypeIconGlyph('Managed Switch')).toBe('▦');
    expect(getDeviceTypeIconGlyph('Access Point')).toBe('⊛');
    expect(getDeviceTypeIconGlyph('AP')).toBe('⊛');
    expect(getDeviceTypeIconGlyph('Wi-Fi Router')).toBe('◈');
  });

  it('matches compute and handheld types', () => {
    expect(getDeviceTypeIconGlyph('NAS')).toBe('▣');
    expect(getDeviceTypeIconGlyph('Home Server')).toBe('▣');
    expect(getDeviceTypeIconGlyph('Docker container')).toBe('◧');
    expect(getDeviceTypeIconGlyph('MacBook Pro')).toBe('◫');
    expect(getDeviceTypeIconGlyph('Android Tablet')).toBe('▬');
    expect(getDeviceTypeIconGlyph('iPhone')).toBe('▯');
  });

  it('prefers speaker over generic stream/audio wording', () => {
    expect(getDeviceTypeIconGlyph('WiFi Speaker')).toBe('♫');
  });

  it('falls back to default for unknown labels', () => {
    expect(getDeviceTypeIconGlyph('FooBar2000')).toBe('●');
  });
});
