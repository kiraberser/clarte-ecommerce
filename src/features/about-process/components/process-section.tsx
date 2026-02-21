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

export function ProcessSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <FadeIn>
        <div className="mb-16 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Nuestro Proceso
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
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
              <div className="flex h-16 w-16 items-center justify-center border bg-secondary">
                <step.icon className={`h-6 w-6 ${step.ecoBadge ? "text-eco" : ""}`} />
              </div>
              <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
              {step.ecoBadge && (
                <span className="inline-flex items-center gap-1 mt-2 text-xs text-eco">
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
        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 rounded border border-eco/30 bg-eco/5 px-6 py-4 text-xs text-eco sm:gap-10">
          <span className="flex items-center gap-1.5">
            <Leaf size={12} />
            PLA renovable
          </span>
          <span className="hidden sm:block text-eco/30">·</span>
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3 w-3" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Sin desperdicio
          </span>
          <span className="hidden sm:block text-eco/30">·</span>
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3 w-3" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253" />
            </svg>
            Fabricado en México
          </span>
        </div>
      </FadeIn>
    </section>
  );
}
