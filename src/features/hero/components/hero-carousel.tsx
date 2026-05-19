"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Slide {
  tagline: string;
  headline: string;
  description: ReactNode;
  cta: string;
}

const slides: Slide[] = [
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
    description: (
      <>
        Cada pieza nace como un modelo digital y cobra vida a través de impresión 3D en PLA{" "}
        <span className="font-medium text-sage">ecológico</span> con acabado artesanal.
      </>
    ),
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

function SlideContent({ slide, isActive }: { slide: Slide; isActive: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <motion.p
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.5, delay: isActive ? 0.1 : 0 }}
        className="text-xs font-medium uppercase tracking-[0.3em] text-sunset"
      >
        {slide.tagline}
      </motion.p>

      <motion.h1
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: isActive ? 0.25 : 0, ease: [0.77, 0, 0.175, 1] }}
        className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-tight tracking-tight text-forest sm:text-6xl lg:text-7xl"
      >
        {slide.headline}
      </motion.h1>

      <motion.p
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.6, delay: isActive ? 0.5 : 0 }}
        className="mt-6 max-w-lg text-base text-muted-foreground"
      >
        {slide.description}
      </motion.p>

      <motion.div
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.5, delay: isActive ? 0.7 : 0 }}
      >
        <Link
          href="/collection"
          className="mt-10 inline-flex h-11 items-center rounded-lg bg-sunset px-10 text-sm font-medium text-white transition-colors hover:bg-sunset/85 active:scale-[0.98]"
        >
          {slide.cta}
        </Link>
      </motion.div>
    </div>
  );
}

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
    <section className="relative min-h-[75vh] overflow-hidden" ref={emblaRef}>
      {/* Decorative sunset radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 80%, hsl(24 81% 54% / 0.08), transparent 60%)",
        }}
      />

      <div className="flex min-h-[75vh]">
        {slides.map((slide, i) => (
          <div
            key={i}
            className="flex min-h-[75vh] min-w-0 flex-[0_0_100%] flex-col items-center justify-center px-6 text-center"
          >
            <SlideContent slide={slide} isActive={selectedIndex === i} />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className="group relative flex h-6 w-6 items-center justify-center"
            aria-label={`Ir al slide ${i + 1}`}
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                selectedIndex === i
                  ? "h-2.5 w-2.5 bg-sunset"
                  : "h-2 w-2 bg-sunset/25 group-hover:bg-sunset/50"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
