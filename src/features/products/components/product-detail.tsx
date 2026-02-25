"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Heart, Minus, Plus, Share2, Check, Link2, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { ProductDetail as ProductDetailType } from "@/shared/types/api";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";
import { useCartStore } from "@/features/cart/store/use-cart-store";
import { useWishlistStore } from "@/features/products/store/use-wishlist-store";
import { useAuth } from "@/shared/lib/auth-context";
import { addToWishlist, removeFromWishlist } from "@/shared/lib/services/products-client";
import { ProductMainImage } from "@/features/products/components/product-image-gallery";
import { ProductGalleryGrid } from "@/features/products/components/product-image-gallery";

interface ProductDetailProps {
  product: ProductDetailType;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { isAuthenticated } = useAuth();
  const { add, remove, isWishlisted } = useWishlistStore();
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  const wishlisted = isWishlisted(product.id);

  async function handleCopyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Enlace copiado al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  }

  function handleShareEmail() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(product.nombre);
    window.open(`mailto:?subject=${title}&body=${url}`, "_self");
  }

  function handleShareFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank", "noopener,noreferrer");
  }

  function handleShareX() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(product.nombre);
    window.open(`https://x.com/intent/post?url=${url}&text=${text}`, "_blank", "noopener,noreferrer");
  }

  async function handleWishlist() {
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

          {!product.en_stock ? (
            <p className="mt-2 text-sm font-medium text-destructive">Agotado</p>
          ) : product.stock > 0 && product.stock <= 5 ? (
            <p className="mt-2 text-sm font-medium text-amber-600">
              ¡Solo quedan {product.stock} {product.stock === 1 ? "unidad" : "unidades"}!
            </p>
          ) : null}

          {/* Row 1: Quantity + Add to Cart */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex items-center border">
              <button
                className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-secondary disabled:opacity-40"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Disminuir cantidad"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-10 text-center text-sm font-medium">
                {quantity}
              </span>
              <button
                className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-secondary disabled:opacity-40"
                onClick={() => setQuantity((q) => Math.min(q + 1, product.stock))}
                disabled={quantity >= product.stock}
                aria-label="Aumentar cantidad"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <Button
              size="lg"
              className="flex-1"
              onClick={() => {
                addItem(product, quantity);
                toast.success(`${product.nombre} agregado al carrito`, {
                  description: `Cantidad: ${quantity}`,
                });
              }}
              disabled={!product.en_stock}
            >
              {product.en_stock ? "Agregar al Carrito" : "Agotado"}
            </Button>
          </div>

          {/* Row 2: Wishlist + Share */}
          <div className="mt-3 flex items-center gap-1">
            <button
              onClick={handleWishlist}
              aria-label={wishlisted ? "Quitar de favoritos" : "Guardar en favoritos"}
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-colors",
                  wishlisted && "fill-foreground text-foreground",
                )}
              />
              {wishlisted ? "Guardado" : "Guardar"}
            </button>
            <span className="text-muted-foreground/30">·</span>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  aria-label="Compartir producto"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Share2 className="h-4 w-4" />
                  Compartir
                </button>
              </PopoverTrigger>
              <PopoverContent side="top" align="start" className="w-auto p-2">
                <div className="flex items-center gap-1">
                  {/* Copy link */}
                  <button
                    onClick={handleCopyLink}
                    aria-label="Copiar enlace"
                    className="flex h-9 w-9 items-center justify-center rounded-full border bg-background transition-colors hover:bg-secondary"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-foreground" />
                    ) : (
                      <Link2 className="h-4 w-4 text-foreground" />
                    )}
                  </button>
                  {/* Email */}
                  <button
                    onClick={handleShareEmail}
                    aria-label="Compartir por email"
                    className="flex h-9 w-9 items-center justify-center rounded-full border bg-background transition-colors hover:bg-secondary"
                  >
                    <Mail className="h-4 w-4 text-foreground" />
                  </button>
                  {/* Facebook */}
                  <button
                    onClick={handleShareFacebook}
                    aria-label="Compartir en Facebook"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2] transition-opacity hover:opacity-90"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
                      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                    </svg>
                  </button>
                  {/* X (Twitter) */}
                  <button
                    onClick={handleShareX}
                    aria-label="Compartir en X"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-opacity hover:opacity-80"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
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
