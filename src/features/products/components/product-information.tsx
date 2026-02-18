"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ProductDetail } from "@/shared/types/api";

interface ProductInformationProps {
  product: ProductDetail;
}

export function ProductInformation({ product }: ProductInformationProps) {
  const { dimensiones, detalles_tecnicos, materiales } = product;

  const hasDimensiones =
    dimensiones && Object.keys(dimensiones).length > 0;
  const hasDetalles =
    detalles_tecnicos && Object.keys(detalles_tecnicos).length > 0;
  const hasMateriales = materiales && materiales.length > 0;

  if (!hasDimensiones && !hasDetalles && !hasMateriales) return null;

  const image =
    product.imagenes?.[0] ?? product.imagen_principal;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-14 text-center text-xs font-medium uppercase tracking-[0.35em] text-foreground"
      >
        Product Information.
      </motion.h2>

      <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2">
        {/* Left — specs */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-10"
        >
          {hasDimensiones && (
            <div>
              <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                Dimensiones
              </h3>
              <dl className="space-y-2">
                {Object.entries(dimensiones).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b border-border/50 pb-2 text-sm">
                    <dt className="capitalize text-muted-foreground">
                      {key.replace(/_/g, " ")}
                    </dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {hasDetalles && (
            <div>
              <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                Detalles Tecnicos
              </h3>
              <dl className="space-y-2">
                {Object.entries(detalles_tecnicos).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b border-border/50 pb-2 text-sm">
                    <dt className="capitalize text-muted-foreground">
                      {key.replace(/_/g, " ")}
                    </dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {hasMateriales && (
            <div>
              <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                Materiales
              </h3>
              <ul className="space-y-1.5">
                {materiales.map((mat) => (
                  <li key={mat} className="text-sm text-muted-foreground">
                    — {mat}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        {/* Right — image */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
            <Image
              src={image}
              alt={`${product.nombre} — detalle`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <p className="mt-3 text-center text-xs italic text-muted-foreground">
            {product.nombre}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
