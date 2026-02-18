import Link from "next/link";
import { getCategories } from "@/shared/lib/services/products";
import { FeaturedProducts } from "@/features/products/components/featured-products";
import { HeroCarousel } from "@/features/hero/components/hero-carousel";
import { ProcessSection } from "@/features/about-process/components/process-section";
import { ReviewsSection } from "@/features/reviews/components/reviews-section";

export default async function Home() {
  const categories = await getCategories();

  return (
    <>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Proceso 3D */}
      <ProcessSection />

      {/* Reviews */}
      <ReviewsSection />

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
          <div className="mb-12">
            <h2 className="text-2xl font-semibold tracking-tight">
              Comprar por Categoría
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Encuentra la luz perfecta para cada rincón.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/collection?category=${category.slug}`}
                className="group flex h-32 items-center justify-center border bg-secondary transition-colors hover:bg-foreground hover:text-background"
              >
                <span className="text-sm font-medium tracking-wide">
                  {category.nombre}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
