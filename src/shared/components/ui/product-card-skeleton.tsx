import { Skeleton } from "@/shared/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="mt-4 space-y-1">
        <Skeleton className="h-4 w-3/4 rounded-none" />
        <Skeleton className="h-4 w-1/4 rounded-none" />
      </div>
      <Skeleton className="mt-3 h-8 w-full rounded-none" />
    </div>
  );
}
