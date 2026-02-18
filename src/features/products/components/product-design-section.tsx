"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ProductDetail } from "@/shared/types/api";

interface ProductDesignSectionProps {
  product: ProductDetail;
}

export function ProductDesignSection({ product }: ProductDesignSectionProps) {
  const images = [
    product.imagen_principal,
    ...(product.imagenes ?? []),
  ].filter(Boolean);

  const img1 = images[1] ?? images[0];
  const img2 = images[2] ?? images[0];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      {/* Row 1: image left, text right */}
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative aspect-[4/5] overflow-hidden bg-secondary"
        >
          <Image
            src={img1}
            alt={`${product.nombre} — diseño`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="space-y-5"
        >
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Mas que diseño
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Cada pieza es el resultado de un proceso artesanal donde la
            funcionalidad se encuentra con la estética. Nuestros artesanos
            combinan técnicas tradicionales con tecnología contemporánea para
            crear luminarias que transforman cualquier espacio en una
            experiencia sensorial única.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            El cuidado en cada detalle — desde la selección de materiales hasta
            el acabado final — garantiza una pieza que no solo ilumina, sino
            que cuenta una historia.
          </p>
        </motion.div>
      </div>

      {/* Row 2: text left, image right */}
      <div className="mt-20 grid grid-cols-1 items-center gap-12 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="order-2 space-y-5 md:order-1"
        >
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Materiales nobles
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Seleccionamos cuidadosamente cada componente: polímeros
            biodegradables de última generación, acero inoxidable de grado
            premium y acabados resistentes que mantienen su belleza con el
            paso del tiempo.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            La sustentabilidad es parte de nuestro ADN. Cada material es
            elegido no solo por su calidad estética, sino también por su
            impacto ambiental reducido.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative order-1 aspect-[4/5] overflow-hidden bg-secondary md:order-2"
        >
          <Image
            src={img2}
            alt={`${product.nombre} — materiales`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>
      </div>
    </section>
  );
}
