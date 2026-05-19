import Link from "next/link";
import { getCategories } from "@/shared/lib/services/products";
import { FeaturedProducts } from "@/features/products/components/featured-products";
import { HeroCarousel } from "@/features/hero/components/hero-carousel";
import { ProcessSection } from "@/features/about-process/components/process-section";
import { GallerySection } from "@/features/products/components/gallery-section";
import { TestimonialsSection } from "@/features/products/components/testimonials-section";
import { SunsetDivider } from "@/shared/components/sunset-divider";

export default async function Home() {
  const categories = await getCategories();

  return (
    <>
      {/* Hero Carousel */}
      <HeroCarousel />

      <SunsetDivider className="py-8" />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Proceso 3D */}
      <ProcessSection />

      <SunsetDivider className="py-8" />

      {/* Galería Editorial */}
      <GallerySection />

      {/* Testimonios */}
      <TestimonialsSection />

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-sunset">
              Explorar
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-forest sm:text-4xl">
              Comprar por Categoría
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              Encuentra la luz perfecta para cada rincón.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/collection?category=${category.slug}`}
                className="group relative flex h-32 items-center justify-center overflow-hidden rounded-lg border border-sunset/15 bg-sunset/[0.04] transition-all duration-300 hover:border-sunset/40 hover:bg-sunset hover:shadow-lg hover:shadow-sunset/15"
              >
                <span className="text-sm font-medium tracking-wide text-foreground/70 transition-colors group-hover:text-white">
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
