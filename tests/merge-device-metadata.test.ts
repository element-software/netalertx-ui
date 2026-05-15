import { describe, expect, it } from 'vitest';
import { mergeDeviceMetadata } from '@/lib/netalertx/graphql-devices';
import type { Device } from '@/lib/netalertx/types';

function minimalDevice(partial: Partial<Device> & Pick<Device, 'id' | 'macAddress'>): Device {
  return {
    name: partial.displayName ?? 'x',
    displayName: partial.displayName ?? 'x',
    status: 'online',
    isOnline: true,
    isKnown: true,
    isNew: false,
    isUnknown: false,
    isPrivateMac: false,
    source: 'netalertx',
    ...partial,
  };
}

describe('mergeDeviceMetadata', () => {
  it('fills metadata from table export rows keyed by MAC', () => {
    const gql = [
      minimalDevice({
        id: 'a',
        macAddress: 'aa:bb:cc:dd:ee:01',
        displayName: 'One',
        group: undefined,
        location: undefined,
        staticIp: undefined,
      }),
    ];
    const table = [
      minimalDevice({
        id: 'b',
        macAddress: 'AA-BB-CC-DD-EE-01',
        displayName: 'ignored',
        group: 'LAN',
        location: 'Office',
        staticIp: true,
      }),
    ];
    const merged = mergeDeviceMetadata(gql, table);
    expect(merged[0]?.group).toBe('LAN');
    expect(merged[0]?.location).toBe('Office');
    expect(merged[0]?.staticIp).toBe(true);
    expect(merged[0]?.displayName).toBe('One');
  });
});
