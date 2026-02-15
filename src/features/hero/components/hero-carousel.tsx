"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    tagline: "Iluminación de Autor",
    headline: "Ilumina tu Espacio",
    description:
      "Descubre lámparas artesanales diseñadas para transformar cada rincón en una declaración de elegancia moderna.",
    cta: "Ver Colección",
  },
  {
    tagline: "Tecnología & Diseño",
    headline: "Diseño 3D, Materializado en PLA",
    description:
      "Cada pieza nace como un modelo digital y cobra vida a través de impresión 3D en PLA ecológico con acabado artesanal.",
    cta: "Conocer Más",
  },
  {
    tagline: "Exclusividad",
    headline: "Cada Lámpara, Una Obra de Arte",
    description:
      "Piezas únicas que fusionan innovación tecnológica con la calidez de lo hecho a mano. Ninguna es igual a otra.",
    cta: "Explorar",
  },
];

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative min-h-[70vh] overflow-hidden" ref={emblaRef}>
      <div className="flex min-h-[70vh]">
        {slides.map((slide, i) => (
          <div
            key={i}
            className="flex min-h-[70vh] min-w-0 flex-[0_0_100%] flex-col items-center justify-center px-6 text-center"
          >
            <AnimatePresence mode="wait">
              {selectedIndex === i && (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="flex flex-col items-center"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    {slide.tagline}
                  </p>
                  <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                    {slide.headline}
                  </h1>
                  <p className="mt-6 max-w-lg text-base text-muted-foreground">
                    {slide.description}
                  </p>
                  <Link
                    href="/collection"
                    className="mt-10 inline-flex h-10 items-center border border-foreground px-8 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
                  >
                    {slide.cta}
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-2 w-2 rounded-full transition-colors ${
              selectedIndex === i ? "bg-foreground" : "bg-foreground/25"
            }`}
            aria-label={`Ir al slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
