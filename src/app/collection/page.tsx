import { Suspense } from "react";
import { getProducts, getCategories } from "@/shared/lib/services/products";

import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductFilters } from "@/features/products/components/product-filters";
import { FadeIn } from "@/shared/components/motion-wrapper";
import type { Category } from "@/shared/types/api";

interface CollectionPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function CollectionPage({
  searchParams,
}: CollectionPageProps) {
  const { category, page } = await searchParams;

  const params: Record<string, string> = {};
  if (category) params.categoria__slug = category;
  if (page) params.page = page;

  const [productsData, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  const categoryLabel = category
    ? categories.find((c: Category) => c.slug === category)?.nombre
    : null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <FadeIn>
        <div className="mb-12">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {categoryLabel ?? "Colección"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {productsData.count}{" "}
            {productsData.count === 1 ? "producto" : "productos"}
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="mb-10">
          <Suspense>
            <ProductFilters categories={categories} />
          </Suspense>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <ProductGrid products={productsData.results} />
      </FadeIn>

      {/* Pagination */}
      {productsData.total_pages > 1 && (
        <FadeIn delay={0.3}>
          <div className="mt-12 flex justify-center gap-2">
            {Array.from({ length: productsData.total_pages }, (_, i) => i + 1).map(
              (p) => {
                const params = new URLSearchParams();
                if (category) params.set("category", category);
                params.set("page", String(p));
                return (
                  <a
                    key={p}
                    href={`/collection?${params.toString()}`}
                    className={`flex h-10 w-10 items-center justify-center border text-sm transition-colors hover:bg-foreground hover:text-background ${
                      p === productsData.current_page
                        ? "bg-foreground text-background"
                        : ""
                    }`}
                  >
                    {p}
                  </a>
                );
              }
            )}
          </div>
        </FadeIn>
      )}
    </section>
  );
}
