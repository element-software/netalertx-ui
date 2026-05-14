import { createDashboardStream } from '@/lib/sse/create-dashboard-stream';
export const runtime='nodejs'; export const dynamic='force-dynamic';
export async function GET(){ return new Response(createDashboardStream(), { headers:{ 'Content-Type':'text/event-stream; charset=utf-8', 'Cache-Control':'no-store, no-transform', Connection:'keep-alive' }}); }
