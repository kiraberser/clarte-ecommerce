"use client";

import React from "react";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { motion } from "framer-motion";

/* ── SVG lamp silhouettes ── */

function LampDePie() {
  return (
    <svg
      viewBox="0 0 100 160"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[60%] w-auto"
      aria-hidden="true"
    >
      <ellipse cx="50" cy="148" rx="20" ry="4" />
      <line x1="50" y1="144" x2="50" y2="60" />
      <path d="M50 60 Q80 55 82 30" />
      <path d="M72 30 L90 30 L84 50 L66 50 Z" />
    </svg>
  );
}

function Colgante() {
  return (
    <svg
      viewBox="0 0 80 140"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[60%] w-auto"
      aria-hidden="true"
    >
      <line x1="40" y1="0" x2="40" y2="55" />
      <circle cx="40" cy="82" r="28" />
      <ellipse cx="33" cy="73" rx="7" ry="5" strokeOpacity="0.35" />
    </svg>
  );
}

function ApliqueParede() {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[60%] w-auto"
      aria-hidden="true"
    >
      <rect x="10" y="20" width="8" height="60" rx="2" />
      <path d="M18 50 Q38 50 50 30" />
      <path d="M42 22 L60 22 L56 44 L38 44 Z" />
    </svg>
  );
}

function LampaMesa() {
  return (
    <svg
      viewBox="0 0 100 130"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[60%] w-auto"
      aria-hidden="true"
    >
      <ellipse cx="50" cy="120" rx="18" ry="4" />
      <path d="M38 120 Q40 100 44 90 L56 90 Q60 100 62 120" />
      <line x1="50" y1="90" x2="50" y2="70" />
      <path d="M30 70 L70 70 L62 40 L38 40 Z" />
    </svg>
  );
}

function ColganteGeometrico() {
  return (
    <svg
      viewBox="0 0 80 130"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[60%] w-auto"
      aria-hidden="true"
    >
      <line x1="40" y1="0" x2="40" y2="40" />
      <polygon points="40,42 58,52 58,72 40,82 22,72 22,52" />
      <polygon points="40,50 52,57 52,69 40,76 28,69 28,57" strokeOpacity="0.35" />
    </svg>
  );
}

/* ── Cell types ── */

interface GalleryCell {
  label: string;
  Lamp: () => React.ReactElement;
  isCta?: boolean;
}

const cells: GalleryCell[] = [
  { label: "Lámpara de Pie", Lamp: LampDePie, isCta: true },
  { label: "Colgante", Lamp: Colgante },
  { label: "Aplique de Pared", Lamp: ApliqueParede },
  { label: "Lámpara de Mesa", Lamp: LampaMesa },
  { label: "Colgante Geométrico", Lamp: ColganteGeometrico },
];

const cellVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

/* ── Component ── */

export function GallerySection() {
  const [hero, cell2, cell3, cell4, cell5] = cells;
  const HeroLamp = hero.Lamp;
  const Cell2Lamp = cell2.Lamp;
  const Cell3Lamp = cell3.Lamp;
  const Cell4Lamp = cell4.Lamp;
  const Cell5Lamp = cell5.Lamp;

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-sunset">Galería</p>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-forest sm:text-4xl">
          Luz que Transforma Espacios
        </h2>
        <span className="mt-3 inline-flex items-center gap-1 text-xs text-sage">
          <Leaf size={12} />
          Fotografiado con luz natural
        </span>
      </div>

      <div className="grid auto-rows-[200px] grid-cols-2 gap-3 lg:auto-rows-[260px] lg:grid-cols-3">

        {/* Cell 1 — hero */}
        <motion.div
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={cellVariants}
          className="group relative overflow-hidden rounded-lg bg-sunset/[0.06] transition-all duration-300 hover:bg-sunset/[0.09] lg:col-span-2 lg:row-span-2"
        >
          <div className="flex h-full w-full flex-col items-center justify-center text-sunset/30">
            <HeroLamp />
            <span className="mt-4 text-xs tracking-wide text-foreground/50">{hero.label}</span>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-linen/90 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            <p className="text-sm font-semibold uppercase tracking-widest text-forest">
              {hero.label}
            </p>
            <Link
              href="/collection"
              className="inline-flex h-9 items-center border border-forest px-6 text-xs font-medium text-forest transition-colors hover:bg-forest hover:text-linen"
            >
              Ver Colección
            </Link>
          </div>
        </motion.div>

        {/* Cell 2 */}
        <motion.div
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={cellVariants}
          className="flex h-full flex-col items-center justify-center overflow-hidden rounded-lg bg-sunset/[0.06] text-sunset/30 transition-all duration-300 hover:bg-sunset/[0.09]"
        >
          <Cell2Lamp />
          <span className="mt-3 text-xs tracking-wide text-foreground/50">{cell2.label}</span>
        </motion.div>

        {/* Cell 3 */}
        <motion.div
          custom={2}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={cellVariants}
          className="flex h-full flex-col items-center justify-center overflow-hidden rounded-lg bg-sunset/[0.06] text-sunset/30 transition-all duration-300 hover:bg-sunset/[0.09]"
        >
          <Cell3Lamp />
          <span className="mt-3 text-xs tracking-wide text-foreground/50">{cell3.label}</span>
        </motion.div>

        {/* Cell 4 */}
        <motion.div
          custom={3}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={cellVariants}
          className="flex h-full flex-col items-center justify-center overflow-hidden rounded-lg bg-sunset/[0.06] text-sunset/30 transition-all duration-300 hover:bg-sunset/[0.09]"
        >
          <Cell4Lamp />
          <span className="mt-3 text-xs tracking-wide text-foreground/50">{cell4.label}</span>
        </motion.div>

        {/* Cell 5 */}
        <motion.div
          custom={4}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={cellVariants}
          className="col-span-2 flex h-full flex-col items-center justify-center overflow-hidden rounded-lg bg-sunset/[0.06] text-sunset/30 transition-all duration-300 hover:bg-sunset/[0.09]"
        >
          <Cell5Lamp />
          <span className="mt-3 text-xs tracking-wide text-foreground/50">{cell5.label}</span>
        </motion.div>

      </div>
    </section>
  );
}
