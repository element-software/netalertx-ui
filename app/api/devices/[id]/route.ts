import { getDevice, recentEvents } from '@/lib/db';
export const runtime='nodejs'; export const dynamic='force-dynamic';
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) { const { id } = await params; if (!/^[\w:.-]+$/.test(id)) return Response.json({error:'Invalid device id'}, {status:400}); const device=getDevice(id); if (!device) return Response.json({error:'Device not found'}, {status:404}); const events=recentEvents(100).filter(e=>e.deviceId===id); return Response.json({device,events},{headers:{'Cache-Control':'no-store'}}); }
