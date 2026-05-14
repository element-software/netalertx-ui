import { describe, expect, it } from 'vitest';
import { normaliseDevice } from '@/lib/netalertx/normalise-device';
describe('normaliseDevice', () => {
  it('maps NetAlertX fields into device model', () => {
    const d = normaliseDevice({
      id: 1,
      dev_Name: 'Laptop',
      dev_MAC: '00-11-22-33-44-55',
      dev_LastIP: '192.168.1.9',
      dev_PresentLastScan: '1',
      dev_Vendor: 'Dell',
    });
    expect(d.displayName).toBe('Laptop');
    expect(d.isOnline).toBe(true);
    expect(d.vendor).toBe('Dell');
  });
  it('maps NetAlertX REST/GraphQL camelCase fields', () => {
    const d = normaliseDevice({
      devName: 'Hue',
      devMAC: '00:11:22:33:44:99',
      devIP: '192.168.1.50',
      devStatus: 'online',
      devVendor: 'Philips',
    });
    expect(d.displayName).toBe('Hue');
    expect(d.isOnline).toBe(true);
    expect(d.ipAddress).toBe('192.168.1.50');
  });
  it('treats GraphQL devStatus connected as online', () => {
    const d = normaliseDevice({ devName: 'X', devMAC: '00:11:22:33:44:55', devStatus: 'connected' });
    expect(d.isOnline).toBe(true);
  });
  it('ignores NetAlertX placeholder devName and uses devFQDN', () => {
    const d = normaliseDevice({
      devName: '(name not found)',
      devMAC: '00:11:22:33:44:55',
      devFQDN: 'printer.lan',
      devVendor: 'HP',
    });
    expect(d.displayName).toBe('printer.lan');
  });
  it('ignores placeholder devName and uses vendor when no FQDN', () => {
    const d = normaliseDevice({
      devName: '(name not found)',
      devMAC: '00:11:22:33:44:66',
      devVendor: 'NETGEAR',
    });
    expect(d.displayName).toBe('NETGEAR');
  });
  it('treats NetAlertX devStatus On-line as online', () => {
    const d = normaliseDevice({
      devName: 'Router',
      devMAC: '00:11:22:33:44:77',
      devStatus: 'On-line',
    });
    expect(d.isOnline).toBe(true);
  });
  it('prefers devPresentLastScan for presence when set', () => {
    const d = normaliseDevice({
      devName: 'A',
      devMAC: '00:11:22:33:44:88',
      devPresentLastScan: 1,
      devStatus: 'Off-line',
    });
    expect(d.isOnline).toBe(true);
  });
  it('labels private MAC devices', () => {
    const d = normaliseDevice({ mac: '6A:11:22:33:44:55', online: true });
    expect(d.isPrivateMac).toBe(true);
    expect(d.displayName).toContain('Private MAC');
  });
});
