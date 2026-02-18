"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/shared/types/api";
import { ProductCard } from "@/features/products/components/product-card";
import { Button } from "@/shared/components/ui/button";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' fill='%23e5e5e5'%3E%3Crect width='600' height='600'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%23999'%3EProducto%3C/text%3E%3C/svg%3E";

const MOCK_RELATED: Product[] = [
  {
    id: 9001,
    nombre: "Lámpara Aurora",
    slug: "lampara-aurora",
    precio: 4200,
    precio_oferta: null,
    precio_final: 4200,
    imagen_principal: PLACEHOLDER,
    categoria: 1,
    categoria_nombre: "Lámparas de mesa",
    en_stock: true,
    destacado: false,
  },
  {
    id: 9002,
    nombre: "Lámpara Solsticio",
    slug: "lampara-solsticio",
    precio: 5800,
    precio_oferta: 4900,
    precio_final: 4900,
    imagen_principal: PLACEHOLDER,
    categoria: 1,
    categoria_nombre: "Lámparas de mesa",
    en_stock: true,
    destacado: true,
  },
  {
    id: 9003,
    nombre: "Lámpara Cénit",
    slug: "lampara-cenit",
    precio: 3600,
    precio_oferta: null,
    precio_final: 3600,
    imagen_principal: PLACEHOLDER,
    categoria: 1,
    categoria_nombre: "Lámparas de techo",
    en_stock: true,
    destacado: false,
  },
  {
    id: 9004,
    nombre: "Lámpara Eclipse",
    slug: "lampara-eclipse",
    precio: 6100,
    precio_oferta: null,
    precio_final: 6100,
    imagen_principal: PLACEHOLDER,
    categoria: 1,
    categoria_nombre: "Lámparas de piso",
    en_stock: false,
    destacado: false,
  },
  {
    id: 9005,
    nombre: "Lámpara Bruma",
    slug: "lampara-bruma",
    precio: 4750,
    precio_oferta: 3990,
    precio_final: 3990,
    imagen_principal: PLACEHOLDER,
    categoria: 1,
    categoria_nombre: "Lámparas de mesa",
    en_stock: true,
    destacado: true,
  },
  {
    id: 9006,
    nombre: "Lámpara Duna",
    slug: "lampara-duna",
    precio: 5200,
    precio_oferta: null,
    precio_final: 5200,
    imagen_principal: PLACEHOLDER,
    categoria: 1,
    categoria_nombre: "Lámparas de techo",
    en_stock: true,
    destacado: false,
  },
];

interface RelatedProductsCarouselProps {
  products?: Product[];
}

export function RelatedProductsCarousel({
  products,
}: RelatedProductsCarouselProps) {
  const items = products && products.length > 0 ? products : MOCK_RELATED;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <div className="mb-10 flex items-center justify-between">
        <h2 className="text-xs font-medium uppercase tracking-[0.35em] text-foreground">
          Productos Relacionados
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={scrollPrev}
            aria-label="Anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={scrollNext}
            aria-label="Siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-4 flex">
          {items.map((product) => (
            <div
              key={product.id}
              className="min-w-0 shrink-0 basis-full pl-4 sm:basis-1/2 lg:basis-1/4"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
