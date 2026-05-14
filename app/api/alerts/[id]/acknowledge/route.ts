import { acknowledgeAlert } from '@/lib/db';
export const runtime='nodejs'; export const dynamic='force-dynamic';
export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) { const { id } = await params; if (!/^[\w:.-]+$/.test(id)) return Response.json({error:'Invalid alert id'}, {status:400}); const ok=acknowledgeAlert(id); return Response.json({ok},{status:ok?200:404,headers:{'Cache-Control':'no-store'}}); }
