"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

export default function CollectionError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        No se pudo cargar la colección
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Ocurrió un error al obtener los productos. Por favor, intenta de nuevo.
      </p>
      <div className="mt-6 flex gap-3">
        <Button variant="outline" onClick={reset}>
          Reintentar
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Ir al inicio</Link>
        </Button>
      </div>
    </div>
  );
}
