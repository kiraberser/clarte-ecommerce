import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";

interface MetricCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
}

export function MetricCard({ label, value, icon: Icon }: MetricCardProps) {
  return (
    <Card className="border-[hsl(0_0%_16%)] bg-[hsl(0_0%_9%)]">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-[hsl(0_0%_16%)] bg-[hsl(0_0%_12%)]">
          <Icon className="h-5 w-5 text-[hsl(0_0%_55%)]" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-[hsl(0_0%_55%)] uppercase">
            {label}
          </p>
          <p className="mt-0.5 truncate font-mono text-xl font-semibold text-[hsl(0_0%_93%)]">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
