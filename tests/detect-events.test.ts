import { describe, expect, it } from 'vitest';

import { detectEvents } from '@/lib/monitor/detect-events';
import type { Device } from '@/lib/netalertx/types';

const base: Device = {
  id: 'a',
  name: 'A',
  displayName: 'A',
  status: 'offline',
  isOnline: false,
  isKnown: true,
  isNew: false,
  isUnknown: false,
  isPrivateMac: false,
  source: 'demo',
};

describe('detectEvents', () => {
  it('does not emit first-seen / joined on baseline poll (empty previous)', () => {
    expect(detectEvents([], [{ ...base, isOnline: true, status: 'online' }])).toEqual([]);
  });

  it('detects first-seen / joined after a snapshot exists', () => {
    const prev: Device[] = [{ ...base, isOnline: true, status: 'online' }];
    const b: Device = {
      id: 'b',
      name: 'B',
      displayName: 'B',
      status: 'online',
      isOnline: true,
      isKnown: true,
      isNew: true,
      isUnknown: false,
      isPrivateMac: false,
      source: 'demo',
    };
    const types = detectEvents(prev, [...prev, b]).map((e) => e.type);
    expect(types).toContain('device_first_seen');
    expect(types).toContain('device_joined');
  });

  it('detects disconnected / reconnected changes', () => {
    expect(
      detectEvents([{ ...base, isOnline: true, status: 'online' }], [base]).map((e) => e.type),
    ).toContain('device_disconnected');
    expect(detectEvents([base], [{ ...base, isOnline: true, status: 'online' }]).map((e) => e.type)).toContain(
      'device_reconnected',
    );
  });
});
