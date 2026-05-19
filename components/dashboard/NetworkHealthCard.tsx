import { Card } from '@/components/ui/Card';
import { StatusBadge } from './StatusBadge';

export function NetworkHealthCard({ summary }: { summary: any }) {
  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <h2 className="text-xl font-bold">Network status</h2>
          <p className="mt-2 text-slate-400">
            {summary.isStale ? 'Data is stale. Check NetAlertX or backend connectivity.' : 'Live data is current.'}
          </p>
        </div>
        <div className="shrink-0 sm:pt-0.5">
          <StatusBadge label="NetAlertX" status={summary.status} />
        </div>
      </div>
    </Card>
  );
}
