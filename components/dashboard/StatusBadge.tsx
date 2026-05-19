import { Badge } from "@/components/ui/Badge";
export function StatusBadge({
  label,
  status,
}: {
  label: string;
  status: string;
}) {
  const tone =
    status === "connected"
      ? "green"
      : status === "demo"
        ? "blue"
        : status === "stale" || status === "updating"
          ? "amber"
          : "red";
  return (
    <Badge tone={tone}>
      {label} {status.replaceAll("_", " ")}
    </Badge>
  );
}
