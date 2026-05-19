import { getFeaturedProducts } from "@/shared/lib/services/products";
import { ProductGrid } from "@/features/products/components/product-grid";

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (!products?.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="mb-12 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-sunset">
          Curada para Ti
        </p>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-forest sm:text-4xl">
          Colección Destacada
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          Piezas curadas que definen la iluminación moderna.
        </p>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
