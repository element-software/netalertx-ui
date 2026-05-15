import { recentEvents } from '@/lib/db';
import { EventList } from '@/components/events/EventList';

export const dynamic = 'force-dynamic';

export default function EventsPage() {
  return (
    <div className="h-full overflow-y-auto overscroll-y-contain p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-5 text-4xl font-black sm:mb-6 sm:text-5xl">Recent events</h1>
        <EventList events={recentEvents(100)} />
      </div>
    </div>
  );
}
