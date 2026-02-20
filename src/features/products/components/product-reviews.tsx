"use client";

import { useState } from "react";
import useSWR from "swr";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/shared/lib/auth-context";
import { getProductReviews, createReview } from "@/shared/lib/services/products-client";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/lib/utils";
import type { ProductReview } from "@/shared/types/api";

interface ProductReviewsProps {
  slug: string;
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i <= rating ? "fill-foreground text-foreground" : "text-muted-foreground",
          )}
        />
      ))}
    </div>
  );
}

function StarSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${i} estrella${i > 1 ? "s" : ""}`}
        >
          <Star
            className={cn(
              "h-6 w-6 transition-colors",
              i <= (hovered || value)
                ? "fill-foreground text-foreground"
                : "text-muted-foreground",
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function ProductReviews({ slug }: ProductReviewsProps) {
  const { user, isAuthenticated } = useAuth();
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data: reviews = [], mutate } = useSWR<ProductReview[]>(
    `reviews-${slug}`,
    () => getProductReviews(slug),
  );

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const userFullName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username
    : null;
  const userReview = userFullName
    ? reviews.find((r) => r.usuario_nombre === userFullName)
    : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Selecciona una calificación");
      return;
    }
    setSubmitting(true);
    try {
      await createReview(slug, { rating, comentario });
      toast.success("¡Gracias por tu reseña!");
      setRating(0);
      setComentario("");
      await mutate();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error al enviar la reseña.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <Separator className="mb-12" />

      <h2 className="text-2xl font-semibold tracking-tight">Reseñas</h2>

      {reviews.length > 0 && (
        <div className="mt-2 flex items-center gap-3">
          <StarDisplay rating={Math.round(average)} />
          <span className="text-sm text-muted-foreground">
            {average.toFixed(1)} de 5 — {reviews.length}{" "}
            {reviews.length === 1 ? "reseña" : "reseñas"}
          </span>
        </div>
      )}

      {/* Review list */}
      {reviews.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Aún no hay reseñas. ¡Sé el primero en opinar!
        </p>
      ) : (
        <div className="mt-8 space-y-6">
          {reviews.map((r) => (
            <div key={r.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{r.usuario_nombre}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <StarDisplay rating={r.rating} />
              {r.comentario && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {r.comentario}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Write review */}
      <div className="mt-10">
        {!isAuthenticated ? (
          <p className="text-sm text-muted-foreground">
            <a href="/login" className="underline underline-offset-4 hover:text-foreground transition-colors">
              Inicia sesión
            </a>{" "}
            para dejar una reseña.
          </p>
        ) : userReview ? (
          <p className="text-sm text-muted-foreground">
            Ya reseñaste este producto.
          </p>
        ) : (
          <div className="max-w-lg">
            <h3 className="text-base font-medium mb-4">Escribir reseña</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <p className="text-sm text-muted-foreground">Calificación</p>
                <StarSelector value={rating} onChange={setRating} />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="comentario"
                  className="text-sm text-muted-foreground"
                >
                  Comentario{" "}
                  <span className="text-xs">(opcional)</span>
                </label>
                <textarea
                  id="comentario"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  rows={3}
                  className="w-full resize-none border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                  placeholder="¿Qué te pareció este producto?"
                />
              </div>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Enviando…" : "Publicar reseña"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
