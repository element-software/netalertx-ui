import { getAlerts, getDevices, getState, saveAlerts, saveDevices, saveEvents, setState } from '@/lib/db';
import { NetAlertXClient } from '@/lib/netalertx/client';
import { makeEvent } from '@/lib/netalertx/normalise-event';
import type { DashboardSummary, Device } from '@/lib/netalertx/types';
import { createAlerts } from './alerts';
import { detectEvents } from './detect-events';
import { calculateSummary } from './summary';
export async function pollNetAlertX(): Promise<DashboardSummary> { const previous = getDevices(); try { const devices = await new NetAlertXClient().getDevices(); const events = detectEvents(previous, devices); const wasDown = getState<boolean>('netalertx_unreachable'); if (wasDown) events.unshift(makeEvent('netalertx_recovered','NetAlertX recovered',undefined,undefined,'info')); saveDevices(devices); saveEvents(events); const existing = getAlerts(true); const alerts = createAlerts(events, devices, existing); saveAlerts(alerts); const now = new Date().toISOString(); setState('last_successful_update', now); setState('netalertx_unreachable', false); return calculateSummary(devices, events, getAlerts(), 'connected', now); } catch { const event = makeEvent('netalertx_unreachable','NetAlertX is unreachable',undefined,undefined,'critical'); saveEvents([event]); setState('netalertx_unreachable', true); return calculateSummary(previous as Device[], [event], getAlerts(), 'netalertx_unreachable', getState<string>('last_successful_update')); } }

