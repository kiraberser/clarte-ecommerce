"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import type { ProductDetail as ProductDetailType } from "@/shared/types/api";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/lib/utils";
import { useCartStore } from "@/features/cart/store/use-cart-store";
import { ProductMainImage } from "@/features/products/components/product-image-gallery";
import { ProductGalleryGrid } from "@/features/products/components/product-image-gallery";

interface ProductDetailProps {
  product: ProductDetailType;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const allImages = [
    product.imagen_principal,
    ...(product.imagenes ?? []),
  ].filter(Boolean);

  const hasDiscount = product.precio_oferta !== null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      {/* Breadcrumb + Back */}
      <div className="mb-10 flex items-center justify-between">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Inicio
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            href="/collection"
            className="transition-colors hover:text-foreground"
          >
            Colección
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">{product.nombre}</span>
        </nav>
        <button
          onClick={() => router.back()}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          &lt; Volver
        </button>
      </div>

      {/* Main: Image + Info */}
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <ProductMainImage
            src={allImages[selectedIndex]}
            name={product.nombre}
            index={selectedIndex}
          />
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

          <div className="mt-6">
            <p
              className={cn(
                "leading-relaxed text-muted-foreground",
                !expanded && "line-clamp-3"
              )}
            >
              {product.descripcion}
            </p>
            {product.descripcion && product.descripcion.length > 150 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-1 text-sm font-medium underline underline-offset-4 transition-colors hover:text-foreground"
              >
                {expanded ? "Leer menos" : "Leer más"}
              </button>
            )}
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            SKU: {product.sku}
          </p>

          {!product.en_stock && (
            <p className="mt-2 text-sm text-destructive">Agotado</p>
          )}

          <Button
            size="lg"
            className="mt-8 w-full"
            onClick={() => addItem(product)}
            disabled={!product.en_stock}
          >
            {product.en_stock ? "Agregar al Carrito" : "Agotado"}
          </Button>
        </motion.div>
      </div>

      {/* Separator */}
      {allImages.length > 1 && (
        <>
          <Separator className="my-12" />

          {/* Gallery Grid */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          >
            <ProductGalleryGrid
              images={allImages}
              name={product.nombre}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
            />
          </motion.div>

          <Separator className="mt-12" />
        </>
      )}
    </section>
  );
}
