import type { Device } from '@/lib/netalertx/types';
export function classificationLabel(device: Device) { if (device.isPrivateMac) return 'Private MAC / Unknown Mobile Device'; return device.deviceType || device.vendor || (device.isUnknown ? 'Unknown Device' : 'Known Device'); }
