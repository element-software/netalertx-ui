import { Card } from '@/components/ui/Card';

const items = [
  ['onlineCount', 'Online', 'text-emerald-200'],
  ['unknownCount', 'Unknown', 'text-amber-200'],
  ['newTodayCount', 'New today', 'text-cyan-200'],
  ['recentlyDisconnectedCount', 'Disconnected', 'text-rose-200'],
] as const;

export function SummaryCards({ summary }: { summary: any }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {items.map(([key, label, color]) => (
        <Card key={key}>
          <p className="text-xs text-slate-400 sm:text-sm">{label}</p>
          <p className={`mt-1 text-4xl font-black tabular-nums sm:mt-2 sm:text-5xl ${color}`}>{summary[key]}</p>
        </Card>
      ))}
    </div>
  );
}
