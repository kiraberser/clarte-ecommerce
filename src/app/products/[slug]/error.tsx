"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default function ProductError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <Link
        href="/collection"
        className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a la colección
      </Link>

      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          No se pudo cargar el producto
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ocurrió un error al obtener este producto. Por favor, intenta de
          nuevo.
        </p>
        <Button variant="outline" className="mt-6" onClick={reset}>
          Reintentar
        </Button>
      </div>
    </div>
  );
}
