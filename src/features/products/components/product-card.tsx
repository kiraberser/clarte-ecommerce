"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/shared/types/api";
import { Button } from "@/shared/components/ui/button";
import { useCartStore } from "@/features/cart/store/use-cart-store";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const hasDiscount = product.precio_oferta !== null;

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
