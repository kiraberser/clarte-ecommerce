import { getFeaturedProducts } from "@/shared/lib/services/products";
import { ProductGrid } from "@/features/products/components/product-grid";

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (!products?.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="mb-12">
        <h2 className="text-2xl font-semibold tracking-tight">
          Colección Destacada
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Piezas curadas que definen la iluminación moderna.
        </p>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
