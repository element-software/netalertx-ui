import { isoNow } from '@/lib/utils/dates';
import type { EventType, NetAlertXEvent } from './types';
export function makeEvent(type: EventType, message: string, deviceId?: string, deviceName?: string, severity: NetAlertXEvent['severity']='info', at=isoNow()): NetAlertXEvent { return { id: `${type}:${deviceId ?? 'system'}:${at}`, type, deviceId, deviceName, message, at, severity }; }
