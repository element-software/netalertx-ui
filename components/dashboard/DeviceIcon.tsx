import { getDeviceTypeIconGlyph } from '@/lib/utils/device-type-icon';

export function DeviceIcon({
  type,
  online,
}: {
  type?: string;
  online?: boolean;
}) {
  const icon = getDeviceTypeIconGlyph(type);
  return (
    <div
      className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-xl leading-none ${online ? 'bg-cyan-300/15 text-cyan-100' : 'bg-slate-700/40 text-slate-400'}`}
      title={type?.trim() ? type.trim() : undefined}
    >
      <span aria-hidden className="select-none">
        {icon}
      </span>
    </div>
  );
}
