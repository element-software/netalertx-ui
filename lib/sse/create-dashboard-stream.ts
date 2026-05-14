import { getEnv } from '@/lib/utils/env';
import { pollNetAlertX } from '@/lib/monitor/poll';
export function createDashboardStream() { const encoder = new TextEncoder(); let timer: ReturnType<typeof setInterval>; return new ReadableStream({ start(controller) { async function send() { const summary = await pollNetAlertX(); controller.enqueue(encoder.encode(`event: summary\ndata: ${JSON.stringify(summary)}\n\n`)); } send().catch(()=>undefined); timer=setInterval(()=>send().catch(()=>undefined), getEnv().pollIntervalSeconds*1000); }, cancel() { clearInterval(timer); } }); }
