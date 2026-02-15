"use client";

import { Star } from "lucide-react";
import { reviews } from "@/shared/lib/mock-data";
import { FadeIn } from "@/shared/components/motion-wrapper";

export function ReviewsSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <FadeIn>
        <div className="mb-16 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Testimonios
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Lo que Dicen Nuestros Clientes
          </h2>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review, i) => (
          <FadeIn key={review.id} delay={i * 0.1}>
            <div className="flex h-full flex-col border bg-secondary/50 p-6">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, starIdx) => (
                  <Star
                    key={starIdx}
                    className={`h-4 w-4 ${
                      starIdx < review.rating
                        ? "fill-foreground text-foreground"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{review.text}&rdquo;
              </p>
              <p className="mt-4 text-sm font-medium">{review.name}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
