import { cn } from "@/shared/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  pendiente: "border-yellow-500/60 text-yellow-400",
  pagado: "border-white/60 text-white",
  enviado: "border-zinc-400/60 text-zinc-300",
  entregado: "border-green-500/60 text-green-400",
  cancelado: "border-red-500/60 text-red-400",
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? "border-zinc-600 text-zinc-400";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium capitalize",
        style,
      )}
    >
      {status}
    </span>
  );
}
