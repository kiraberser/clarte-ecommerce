"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import type { ProductDetail as ProductDetailType } from "@/shared/types/api";
import { Button } from "@/shared/components/ui/button";
import { useCartStore } from "@/features/cart/store/use-cart-store";
import { ProductImageGallery } from "@/features/products/components/product-image-gallery";

interface ProductDetailProps {
  product: ProductDetailType;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const addItem = useCartStore((s) => s.addItem);

  const allImages = [
    product.imagen_principal,
    ...(product.imagenes ?? []),
  ].filter(Boolean);

  const hasDiscount = product.precio_oferta !== null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <Link
        href="/collection"
        className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a la colección
      </Link>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <ProductImageGallery images={allImages} name={product.nombre} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="flex flex-col justify-center"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {product.categoria_nombre}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {product.nombre}
          </h1>
          <div className="mt-4 flex items-center gap-3">
            {hasDiscount && (
              <span className="text-xl text-muted-foreground line-through">
                ${Number(product.precio).toLocaleString()}
              </span>
            )}
            <span className="text-2xl font-medium">
              ${Number(product.precio_final).toLocaleString()}
            </span>
          </div>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            {product.descripcion}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            SKU: {product.sku}
          </p>
          {!product.en_stock && (
            <p className="mt-2 text-sm text-destructive">Agotado</p>
          )}
          <Button
            size="lg"
            className="mt-8 w-full sm:w-auto"
            onClick={() => addItem(product)}
            disabled={!product.en_stock}
          >
            {product.en_stock ? "Agregar al Carrito" : "Agotado"}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
