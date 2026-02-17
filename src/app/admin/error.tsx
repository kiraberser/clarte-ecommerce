"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <AlertCircle className="h-10 w-10 text-[hsl(0_0%_40%)]" />
      <h1 className="mt-4 text-lg font-medium">Algo salió mal</h1>
      <p className="mt-1 text-sm text-[hsl(0_0%_55%)]">
        {error.message || "Ocurrió un error inesperado."}
      </p>
      <Button
        variant="outline"
        className="mt-6 border-[hsl(0_0%_25%)] hover:bg-[hsl(0_0%_14%)]"
        onClick={reset}
      >
        Reintentar
      </Button>
    </div>
  );
}
