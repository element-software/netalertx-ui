import { Card } from '@/components/ui/Card';
const items=[['onlineCount','Online','text-emerald-200'],['unknownCount','Unknown','text-amber-200'],['newTodayCount','New today','text-cyan-200'],['recentlyDisconnectedCount','Disconnected','text-rose-200']];
export function SummaryCards({summary}:{summary:any}){return <div className="grid grid-cols-4 gap-4">{items.map(([key,label,color])=><Card key={key}><p className="text-sm text-slate-400">{label}</p><p className={`mt-2 text-5xl font-black ${color}`}>{summary[key]}</p></Card>)}</div>}
