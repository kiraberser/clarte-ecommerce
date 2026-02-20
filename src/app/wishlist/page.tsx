"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useAuth } from "@/shared/lib/auth-context";
import { useWishlistStore } from "@/features/products/store/use-wishlist-store";
import { getWishlist } from "@/shared/lib/services/products-client";
import { ProductGrid } from "@/features/products/components/product-grid";
import type { Product } from "@/shared/types/api";

export default function WishlistPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const ids = useWishlistStore((s) => s.ids);
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    getWishlist()
      .then((items) => setProducts(items.map((i) => i.producto)))
      .finally(() => setFetching(false));
  }, [isAuthenticated, isLoading, router]);

  // Keep product list in sync with store ids (optimistic removes)
  const displayProducts = products.filter((p) => ids.includes(p.id));

  if (isLoading || fetching) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="h-8 w-40 animate-pulse rounded bg-secondary" />
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded bg-secondary" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="flex items-center gap-3">
        <Heart className="h-6 w-6" />
        <h1 className="text-3xl font-semibold tracking-tight">Favoritos</h1>
      </div>

      {displayProducts.length === 0 ? (
        <div className="mt-24 flex flex-col items-center gap-6 text-center">
          <Heart className="h-12 w-12 text-muted-foreground" strokeWidth={1} />
          <p className="text-lg text-muted-foreground">
            Tu lista de deseos está vacía.
          </p>
          <Link
            href="/collection"
            className="text-sm underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Explorar colección
          </Link>
        </div>
      ) : (
        <div className="mt-12">
          <p className="mb-8 text-sm text-muted-foreground">
            {displayProducts.length}{" "}
            {displayProducts.length === 1 ? "producto" : "productos"}
          </p>
          <ProductGrid products={displayProducts} />
        </div>
      )}
    </main>
  );
}
