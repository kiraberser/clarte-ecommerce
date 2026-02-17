import { Skeleton } from "@/shared/components/ui/skeleton";

export function PageHeaderSkeleton() {
  return (
    <div className="mb-12">
      <Skeleton className="h-9 w-48 rounded-none" />
      <Skeleton className="mt-2 h-4 w-32 rounded-none" />
    </div>
  );
}
