import { recentEvents } from '@/lib/db';
export const runtime='nodejs'; export const dynamic='force-dynamic';
export async function GET(){ return Response.json({events:recentEvents(50)},{headers:{'Cache-Control':'no-store'}});}
