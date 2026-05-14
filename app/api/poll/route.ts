import { pollNetAlertX } from '@/lib/monitor/poll';
export const runtime='nodejs'; export const dynamic='force-dynamic';
export async function POST(){ const summary=await pollNetAlertX(); return Response.json(summary,{headers:{'Cache-Control':'no-store'}});}
