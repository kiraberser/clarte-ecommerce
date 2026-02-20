"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { Product } from "@/shared/types/api";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { useCartStore } from "@/features/cart/store/use-cart-store";
import { useWishlistStore } from "@/features/products/store/use-wishlist-store";
import { useAuth } from "@/shared/lib/auth-context";
import { addToWishlist, removeFromWishlist } from "@/shared/lib/services/products-client";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { isAuthenticated } = useAuth();
  const { add, remove, isWishlisted } = useWishlistStore();
  const router = useRouter();

  const wishlisted = isWishlisted(product.id);
  const hasDiscount = product.precio_oferta !== null;

  async function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (wishlisted) {
      remove(product.id);
      await removeFromWishlist(product.id).catch(() => add(product.id));
    } else {
      add(product.id);
      await addToWishlist(product.id).catch(() => {
        remove(product.id);
        toast.error("No se pudo agregar a favoritos.");
      });
    }
  }

  return (
    <motion.div
      className="group"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden border bg-secondary">
          <Image
            src={product.imagen_principal}
            alt={product.nombre}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <button
            onClick={handleWishlist}
            aria-label={wishlisted ? "Quitar de favoritos" : "Agregar a favoritos"}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100"
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                wishlisted ? "fill-foreground text-foreground" : "text-foreground",
              )}
            />
          </button>
        </div>
        <div className="mt-4 space-y-1">
          <h3 className="text-sm font-medium">{product.nombre}</h3>
          <div className="flex items-center gap-2">
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                ${Number(product.precio).toLocaleString()}
              </span>
            )}
            <span className="text-sm text-muted-foreground">
              ${Number(product.precio_final).toLocaleString()}
            </span>
          </div>
        </div>
      </Link>
      <Button
        variant="outline"
        size="sm"
        className="mt-3 w-full"
        onClick={() => addItem(product)}
        disabled={!product.en_stock}
      >
        {product.en_stock ? "Agregar al Carrito" : "Agotado"}
      </Button>
    </motion.div>
  );
}
