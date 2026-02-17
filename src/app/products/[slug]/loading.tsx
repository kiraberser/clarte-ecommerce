import { Skeleton } from "@/shared/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      {/* Back link */}
      <Skeleton className="mb-10 h-4 w-44 rounded-none" />

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Left: image gallery */}
        <div>
          <Skeleton className="aspect-square w-full rounded-none" />
          <div className="mt-3 flex gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-20 rounded-none" />
            ))}
          </div>
        </div>

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
          <Skeleton className="mt-8 h-10 w-full rounded-none sm:w-48" />
        </div>
      </div>
    </section>
  );
}
