"use client";

import { Pen, Printer, Sparkles } from "lucide-react";
import { FadeIn } from "@/shared/components/motion-wrapper";

const steps = [
  {
    icon: Pen,
    title: "Diseño 3D",
    description:
      "Cada lámpara nace como un modelo digital, donde perfeccionamos cada curva y proporción hasta lograr la pieza ideal.",
  },
  {
    icon: Printer,
    title: "Impresión en PLA",
    description:
      "Utilizamos PLA, un material ecológico derivado de recursos renovables, para dar vida a nuestros diseños con precisión milimétrica.",
  },
  {
    icon: Sparkles,
    title: "Acabado Artesanal",
    description:
      "Cada pieza recibe un acabado a mano que le otorga un carácter único. Ninguna lámpara es exactamente igual a otra.",
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
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
