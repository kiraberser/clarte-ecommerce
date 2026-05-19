"use client";

import { Star, Quote } from "lucide-react";
import { reviews } from "@/shared/lib/mock-data";
import { FadeIn } from "@/shared/components/motion-wrapper";

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <FadeIn>
        <div className="mb-16 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-sunset">
            Testimonios
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-forest sm:text-4xl">
            Lo que Dicen Nuestros Clientes
          </h2>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review, i) => (
          <FadeIn key={review.id} delay={i * 0.1}>
            <div className="sunset-glow group flex h-full flex-col rounded-lg border border-forest/10 bg-background-soft p-6 transition-colors hover:border-sunset/20">
              {/* Quote icon */}
              <Quote className="mb-3 h-6 w-6 text-sunset/30 transition-colors group-hover:text-sunset/50" />

              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, starIdx) => (
                  <Star
                    key={starIdx}
                    className={`h-4 w-4 ${
                      starIdx < review.rating
                        ? "fill-sunset text-sunset"
                        : "text-forest/15"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-xs font-medium text-linen">
                  {review.name.charAt(0)}
                </div>
                <p className="text-sm font-medium text-forest">{review.name}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
