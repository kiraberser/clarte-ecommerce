import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-4">
        404
      </p>
      <h1 className="text-2xl font-semibold tracking-tight">
        Página no encontrada
      </h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        La página que buscas no existe o fue movida.
      </p>
      <div className="flex gap-3 mt-6">
        <Button asChild variant="default">
          <Link href="/">Inicio</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/collection">Colección</Link>
        </Button>
      </div>
    </div>
  );
}
