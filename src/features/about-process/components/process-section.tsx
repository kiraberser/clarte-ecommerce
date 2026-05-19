"use client";

import { Leaf, Pen, Printer, Sparkles } from "lucide-react";
import { FadeIn } from "@/shared/components/motion-wrapper";

const steps = [
  {
    icon: Pen,
    title: "Diseño 3D",
    description:
      "Cada lámpara nace como un modelo digital, donde perfeccionamos cada curva y proporción hasta lograr la pieza ideal.",
    ecoBadge: false,
  },
  {
    icon: Printer,
    title: "Impresión en PLA",
    description:
      "Utilizamos PLA, un material ecológico derivado de recursos renovables, para dar vida a nuestros diseños con precisión milimétrica.",
    ecoBadge: true,
  },
  {
    icon: Sparkles,
    title: "Acabado Artesanal",
    description:
      "Cada pieza recibe un acabado a mano que le otorga un carácter único. Ninguna lámpara es exactamente igual a otra.",
    ecoBadge: false,
  },
];

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

export function ProcessSection() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Warm sunset gradient background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #fff 0%, hsl(30 30% 97%) 40%, hsl(24 40% 96%) 70%, #fff 100%)",
        }}
      />

      {/* Decorative sunburst top-right */}
      <div className="pointer-events-none absolute -right-12 -top-12 opacity-[0.07]">
        <SunburstIcon className="h-64 w-64 text-sunset" />
      </div>

      {/* Decorative sunburst bottom-left */}
      <div className="pointer-events-none absolute -bottom-16 -left-16 opacity-[0.05]">
        <SunburstIcon className="h-80 w-80 text-sunset" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn>
          <div className="mb-16 text-center">
            <SunburstIcon className="mx-auto mb-4 h-8 w-8 text-sunset" />
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-sunset">
              Nuestro Proceso
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-forest sm:text-4xl">
              De lo Digital a tu Hogar
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
              Fusionamos tecnología de impresión 3D con artesanía tradicional para crear lámparas que son obras de arte funcionales.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
          {steps.map((step, i) => (
            <FadeIn key={step.title} delay={i * 0.15}>
              <div className="flex flex-col items-center text-center">
                <span className="mb-4 font-display text-5xl font-light text-sunset/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-sunset/20 bg-sunset/5">
                  <step.icon className={`h-6 w-6 ${step.ecoBadge ? "text-sage" : "text-sunset/70"}`} />
                </div>
                <h3 className="mt-6 font-display text-lg font-semibold text-forest">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
                {step.ecoBadge && (
                  <span className="mt-3 inline-flex items-center gap-1 rounded-full border border-sage/30 bg-sage/10 px-3 py-1 text-xs text-sage">
                    <Leaf size={10} />
                    Material renovable
                  </span>
                )}
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Sustainability strip */}
        <FadeIn delay={0.45}>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-6 rounded-lg border border-sage/20 bg-sage/5 px-6 py-4 text-xs text-sage sm:gap-10">
            <span className="flex items-center gap-1.5">
              <Leaf size={12} />
              PLA renovable
            </span>
            <span className="hidden text-sage/30 sm:block">·</span>
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3 w-3" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Sin desperdicio
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
