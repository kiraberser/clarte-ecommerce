import { Skeleton } from "@/shared/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div>
      {/* Toolbar */}
      <div className="mb-6 flex items-center gap-3">
        <Skeleton className="h-9 flex-1 max-w-sm rounded-none bg-[hsl(0_0%_14%)]" />
        <Skeleton className="h-9 w-24 rounded-none bg-[hsl(0_0%_14%)]" />
        <div className="ml-auto">
          <Skeleton className="h-9 w-32 rounded-none bg-[hsl(0_0%_14%)]" />
        </div>
      </div>

      {/* Table */}
      <div className="border border-[hsl(0_0%_16%)]">
        {/* Header row */}
        <div className="flex gap-4 border-b border-[hsl(0_0%_16%)] px-4 py-3">
          {[120, 200, 80, 100, 80].map((w, i) => (
            <Skeleton
              key={i}
              className="h-4 rounded-none bg-[hsl(0_0%_14%)]"
              style={{ width: `${w}px` }}
            />
          ))}
        </div>

        {/* Data rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 border-b border-[hsl(0_0%_16%)] px-4 py-3 last:border-b-0"
          >
            {[120, 200, 80, 100, 80].map((w, j) => (
              <Skeleton
                key={j}
                className="h-4 rounded-none bg-[hsl(0_0%_14%)]"
                style={{ width: `${w}px` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
