import Link from "next/link";
import type { Product } from "@/shared/types/api";
import { ProductCard } from "@/features/products/components/product-card";

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
  emptyHref?: string;
  emptyAction?: string;
}

export function ProductGrid({
  products,
  emptyMessage = "No hay productos disponibles por el momento.",
  emptyHref,
  emptyAction,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        {emptyHref && emptyAction && (
          <Link
            href={emptyHref}
            className="text-sm underline underline-offset-4 transition-colors hover:text-foreground"
          >
            {emptyAction}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
