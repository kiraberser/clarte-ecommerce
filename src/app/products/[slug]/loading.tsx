import { Skeleton } from "@/shared/components/ui/skeleton";
import { Separator } from "@/shared/components/ui/separator";

export default function ProductLoading() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-10 flex items-center justify-between">
        <Skeleton className="h-4 w-56 rounded-none" />
        <Skeleton className="h-4 w-16 rounded-none" />
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Left: main image */}
        <Skeleton className="aspect-square w-full rounded-none" />

        {/* Right: product info */}
        <div className="flex flex-col justify-center">
          <Skeleton className="h-3 w-24 rounded-none" />
          <Skeleton className="mt-3 h-9 w-3/4 rounded-none" />
          <Skeleton className="mt-4 h-7 w-28 rounded-none" />
          <div className="mt-6 space-y-2">
            <Skeleton className="h-4 w-full rounded-none" />
            <Skeleton className="h-4 w-full rounded-none" />
            <Skeleton className="h-4 w-2/3 rounded-none" />
          </div>
          <Skeleton className="mt-3 h-4 w-20 rounded-none" />
          <Skeleton className="mt-8 h-11 w-full rounded-none" />
        </div>
      </div>

      <Separator className="my-12" />

      {/* Gallery grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/3] w-full rounded-none" />
        ))}
      </div>

      <Separator className="mt-12" />
    </section>
  );
}
