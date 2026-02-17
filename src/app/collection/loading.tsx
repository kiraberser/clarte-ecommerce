import { Skeleton } from "@/shared/components/ui/skeleton";
import { PageHeaderSkeleton } from "@/shared/components/ui/page-header-skeleton";
import { ProductCardSkeleton } from "@/shared/components/ui/product-card-skeleton";

export default function CollectionLoading() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <PageHeaderSkeleton />

      {/* Filter chips */}
      <div className="mb-10 flex flex-wrap gap-2">
        {[20, 24, 16, 28, 20].map((w, i) => (
          <Skeleton
            key={i}
            className="h-9 rounded-none"
            style={{ width: `${w * 4}px` }}
          />
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
