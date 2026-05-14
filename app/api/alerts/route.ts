import { getAlerts } from '@/lib/db';
export const runtime='nodejs'; export const dynamic='force-dynamic';
export async function GET(){ return Response.json({alerts:getAlerts()},{headers:{'Cache-Control':'no-store'}});}
