export const ErrorState = ({ message }: { message: string }) => (
  <div className="flex h-full min-h-0 flex-1 items-center justify-center p-8">
    <div className="max-w-lg rounded-3xl border border-rose-400/30 bg-rose-950/30 p-6 text-rose-100">{message}</div>
  </div>
);
