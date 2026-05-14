import { getAlerts, getDevices, getState, recentEvents } from '@/lib/db';
import { calculateSummary } from '@/lib/monitor/summary';
export const runtime='nodejs'; export const dynamic='force-dynamic';
export async function GET(){ const status=getState<boolean>('netalertx_unreachable')?'netalertx_unreachable':'connected'; const body=calculateSummary(getDevices(), recentEvents(20), getAlerts(), status, getState<string>('last_successful_update')); return Response.json(body,{headers:{'Cache-Control':'no-store'}});}
