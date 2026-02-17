import { Skeleton } from "@/shared/components/ui/skeleton";
import { ProductCardSkeleton } from "@/shared/components/ui/product-card-skeleton";

export default function HomeLoading() {
  return (
    <>
      {/* Hero */}
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-10 w-64 rounded-none" />
          <Skeleton className="h-5 w-48 rounded-none" />
          <Skeleton className="mt-4 h-10 w-36 rounded-none" />
        </div>
      </div>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="mb-12">
          <Skeleton className="h-7 w-56 rounded-none" />
          <Skeleton className="mt-2 h-4 w-40 rounded-none" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* Process Steps */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="mb-12">
          <Skeleton className="h-7 w-48 rounded-none" />
          <Skeleton className="mt-2 h-4 w-64 rounded-none" />
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-12 w-12 rounded-none" />
              <Skeleton className="h-5 w-32 rounded-none" />
              <Skeleton className="h-4 w-full rounded-none" />
              <Skeleton className="h-4 w-3/4 rounded-none" />
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="mb-12">
          <Skeleton className="h-7 w-44 rounded-none" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border p-6 space-y-3">
              <Skeleton className="h-4 w-24 rounded-none" />
              <Skeleton className="h-4 w-full rounded-none" />
              <Skeleton className="h-4 w-5/6 rounded-none" />
              <Skeleton className="mt-4 h-4 w-28 rounded-none" />
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="mb-12">
          <Skeleton className="h-7 w-52 rounded-none" />
          <Skeleton className="mt-2 h-4 w-64 rounded-none" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-none" />
          ))}
        </div>
      </section>
    </>
  );
}
