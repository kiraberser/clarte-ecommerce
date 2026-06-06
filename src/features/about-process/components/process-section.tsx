"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Leaf, Plus, Printer, Sparkles } from "lucide-react";
import { FadeIn } from "@/shared/components/motion-wrapper";
import { differentiators } from "@/features/about-process/data/differentiators";

function SunburstIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="6" fill="currentColor" opacity="0.9" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
        <line
          key={angle}
          x1={24 + 10 * Math.cos((angle * Math.PI) / 180)}
          y1={24 + 10 * Math.sin((angle * Math.PI) / 180)}
          x2={24 + 18 * Math.cos((angle * Math.PI) / 180)}
          y2={24 + 18 * Math.sin((angle * Math.PI) / 180)}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
      ))}
    </svg>
  );
}

/* Decorative illustration per differentiator slug */
const illustrations: Record<string, ReactNode> = {
  "diseno-3d": (
    <SunburstIcon className="h-48 w-48 text-white/15 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-45" />
  ),
  "tecnologia-3d": (
    <Printer
      className="h-44 w-44 text-white/15 transition-transform duration-700 group-hover:scale-110"
      strokeWidth={1}
    />
  ),
  "material-sustentable": (
    <Leaf
      className="h-44 w-44 text-white/15 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6"
      strokeWidth={1}
    />
  ),
};

export function ProcessSection() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Warm sunset gradient background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #fff 0%, hsl(30 30% 97%) 40%, hsl(24 40% 96%) 70%, #fff 100%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading — left aligned like the reference */}
        <FadeIn>
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-sunset">
              Nuestro Proceso
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-forest sm:text-4xl">
              Así unimos Diseño
              <br className="hidden sm:block" /> y Tecnología
            </h2>
          </div>
        </FadeIn>

        {/* Differentiator cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {differentiators.map((item, i) => (
            <FadeIn key={item.slug} delay={i * 0.12}>
              <Link
                href={`/proceso/${item.slug}`}
                className={`group relative flex h-[460px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br ${item.gradient} p-7 shadow-lg shadow-forest/10 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-forest/20`}
              >
                {/* Decorative illustration */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  {illustrations[item.slug]}
                </div>

                {/* Bottom legibility gradient */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/35 to-transparent" />

                {/* Top — category label */}
                <div className="relative flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/80">
                    {item.label}
                  </span>
                  {item.ecoBadge && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-white backdrop-blur-sm">
                      <Leaf size={10} />
                      Renovable
                    </span>
                  )}
                </div>

                {/* Bottom — title, description and the "+" action */}
                <div className="relative">
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-[26ch] text-sm leading-relaxed text-white/70">
                    {item.summary}
                  </p>
                  <span className="mt-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-white group-hover:text-forest">
                    <Plus size={18} className="transition-transform duration-300 group-hover:rotate-90" />
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        {/* Sustainability strip */}
        <FadeIn delay={0.45}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 rounded-lg border border-sage/20 bg-sage/5 px-6 py-4 text-xs text-sage sm:gap-10">
            <span className="flex items-center gap-1.5">
              <Leaf size={12} />
              PLA renovable
            </span>
            <span className="hidden text-sage/30 sm:block">·</span>
            <span className="flex items-center gap-1.5">
              <Sparkles size={12} />
              Acabado artesanal
            </span>
            <span className="hidden text-sage/30 sm:block">·</span>
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3 w-3" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253" />
              </svg>
              Fabricado en México
            </span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
