"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

const CONSENT_KEY = "ocaso-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  }

  function essential() {
    localStorage.setItem(CONSENT_KEY, "essential");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background px-6 py-5 shadow-lg">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
          Usamos cookies para mejorar tu experiencia y recordar tus preferencias.
          Consulta nuestra{" "}
          <Link
            href="/legal/politica-cookies"
            className="text-foreground underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            Política de Cookies
          </Link>
          .
        </p>

        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={essential}
            className="text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Solo esenciales
          </button>
          <Button size="sm" onClick={accept}>
            Aceptar todo
          </Button>
          <button
            onClick={essential}
            aria-label="Cerrar"
            className="ml-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
