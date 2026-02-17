"use client";

import { Button } from "@/shared/components/ui/button";

export default function RootError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        Algo salió mal
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Ocurrió un error inesperado. Por favor, intenta de nuevo.
      </p>
      <Button variant="outline" className="mt-6" onClick={reset}>
        Reintentar
      </Button>
    </div>
  );
}
