import { Card } from '@/components/ui/Card';
export function LatestEventCard({event}:{event:any}){return <Card><p className="text-sm text-slate-400">Latest event</p><h2 className="mt-3 text-2xl font-bold">{event?.message || 'No recent events'}</h2><p className="mt-2 text-sm text-slate-500">{event?.at ? new Date(event.at).toLocaleString() : 'Waiting for the first poll'}</p></Card>}
