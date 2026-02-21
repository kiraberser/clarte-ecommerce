import React from "react";
import Link from "next/link";
import { Leaf } from "lucide-react";

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
      {/* base */}
      <ellipse cx="50" cy="148" rx="20" ry="4" />
      {/* stem */}
      <line x1="50" y1="144" x2="50" y2="60" />
      {/* arc */}
      <path d="M50 60 Q80 55 82 30" />
      {/* shade */}
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
      {/* cable */}
      <line x1="40" y1="0" x2="40" y2="55" />
      {/* globe */}
      <circle cx="40" cy="82" r="28" />
      {/* highlight */}
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
      {/* wall plate */}
      <rect x="10" y="20" width="8" height="60" rx="2" />
      {/* curved arm */}
      <path d="M18 50 Q38 50 50 30" />
      {/* shade */}
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
      {/* base */}
      <ellipse cx="50" cy="120" rx="18" ry="4" />
      <path d="M38 120 Q40 100 44 90 L56 90 Q60 100 62 120" />
      {/* stem */}
      <line x1="50" y1="90" x2="50" y2="70" />
      {/* shade */}
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
      {/* cable */}
      <line x1="40" y1="0" x2="40" y2="40" />
      {/* hexagon */}
      <polygon points="40,42 58,52 58,72 40,82 22,72 22,52" />
      {/* inner detail */}
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
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Galería</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Luz que Transforma Espacios
        </h2>
        <span className="mt-3 inline-flex items-center gap-1 text-xs text-eco">
          <Leaf size={12} />
          Fotografiado con luz natural
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:grid-rows-3">
        {/* Cell 1 — hero, 2×2, with CTA overlay */}
        <div className="group relative col-span-1 row-span-1 lg:col-span-1 lg:row-span-2 overflow-hidden bg-secondary transition-transform duration-300 hover:scale-[0.99] hover:bg-secondary/80">
          <div className="flex aspect-square lg:aspect-[3/4] h-full w-full flex-col items-center justify-center text-muted-foreground/60">
            <HeroLamp />
            <span className="mt-4 text-xs tracking-wide text-muted-foreground">{hero.label}</span>
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-foreground/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <p className="text-sm font-semibold uppercase tracking-widest text-background">
              {hero.label}
            </p>
            <Link
              href="/collection"
              className="inline-flex h-9 items-center border border-background px-6 text-xs font-medium text-background transition-colors hover:bg-background hover:text-foreground"
            >
              Ver Colección
            </Link>
          </div>
        </div>

        {/* Cell 2 */}
        <div className="col-span-1 row-span-1 flex aspect-square flex-col items-center justify-center overflow-hidden bg-secondary text-muted-foreground/60 transition-transform duration-300 hover:scale-[0.99] hover:bg-secondary/80">
          <Cell2Lamp />
          <span className="mt-3 text-xs tracking-wide text-muted-foreground">{cell2.label}</span>
        </div>

        {/* Cell 3 */}
        <div className="col-span-1 row-span-1 flex aspect-square flex-col items-center justify-center overflow-hidden bg-secondary text-muted-foreground/60 transition-transform duration-300 hover:scale-[0.99] hover:bg-secondary/80">
          <Cell3Lamp />
          <span className="mt-3 text-xs tracking-wide text-muted-foreground">{cell3.label}</span>
        </div>

        {/* Cell 4 — bottom left */}
        <div className="col-span-1 row-span-1 flex aspect-square flex-col items-center justify-center overflow-hidden bg-secondary text-muted-foreground/60 transition-transform duration-300 hover:scale-[0.99] hover:bg-secondary/80">
          <Cell4Lamp />
          <span className="mt-3 text-xs tracking-wide text-muted-foreground">{cell4.label}</span>
        </div>

        {/* Cell 5 — bottom right, spans 2 cols */}
        <div className="col-span-1 row-span-1 lg:col-span-2 flex aspect-square lg:aspect-auto flex-col items-center justify-center overflow-hidden bg-secondary text-muted-foreground/60 transition-transform duration-300 hover:scale-[0.99] hover:bg-secondary/80">
          <Cell5Lamp />
          <span className="mt-3 text-xs tracking-wide text-muted-foreground">{cell5.label}</span>
        </div>
      </div>
    </section>
  );
}
