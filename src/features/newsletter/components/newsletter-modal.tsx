"use client";

import { useState, useEffect } from "react";
import { Loader2, Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { apiPost, ApiError } from "@/shared/lib/api";

const MODAL_KEY = "ocaso-newsletter-modal";
const DISCOUNT_CODE = "BIENVENIDO10";
const DELAY_MS = 5000;

export function NewsletterModal() {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(MODAL_KEY);
    if (stored) return;

    const timer = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  function handleClose() {
    localStorage.setItem(MODAL_KEY, "dismissed");
    setOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      await apiPost("/contacto/newsletter/", { nombre, email });
      setStatus("success");
      localStorage.setItem(MODAL_KEY, "subscribed");
    } catch (err) {
      setStatus("error");
      if (err instanceof ApiError) {
        setErrorMsg(err.data?.message || "Error al suscribirse.");
      } else {
        setErrorMsg("Error de conexión.");
      }
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(DISCOUNT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="overflow-hidden border-forest/20 p-0 sm:max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Left — promo with forest green */}
          <div className="flex flex-col justify-center bg-forest px-8 py-10 text-linen">
            <p className="text-xs uppercase tracking-[0.3em] text-sunset">
              Oferta exclusiva
            </p>
            <DialogTitle className="mt-3 font-display text-2xl font-semibold leading-tight tracking-tight text-linen">
              10% de descuento en tu primera compra
            </DialogTitle>
            <p className="mt-4 text-sm leading-relaxed text-linen/70">
              Suscríbete a nuestro boletín y recibe el código de descuento al instante.
              Sé el primero en conocer nuevas colecciones y ofertas exclusivas.
            </p>
            <p className="mt-6 text-xs text-linen/40">
              Sin spam. Puedes darte de baja cuando quieras.
            </p>
          </div>

          {/* Right — form or success */}
          <div className="flex flex-col justify-center bg-linen px-8 py-10">
            {status === "success" ? (
              <div className="space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-sage">
                    ¡Listo!
                  </p>
                  <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-forest">
                    Tu código de descuento
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Úsalo en tu próxima compra.
                  </p>
                </div>

                <button
                  onClick={handleCopy}
                  className="flex w-full items-center justify-between rounded-lg border border-forest/10 bg-forest/5 px-4 py-3 transition-colors hover:bg-forest/10"
                >
                  <span className="font-mono text-lg font-semibold tracking-widest text-forest">
                    {DISCOUNT_CODE}
                  </span>
                  {copied ? (
                    <Check className="h-4 w-4 text-sage" />
                  ) : (
                    <Copy className="h-4 w-4 text-sage" />
                  )}
                </button>

                <Button className="w-full bg-forest text-linen hover:bg-forest/90" onClick={handleClose}>
                  Ir a la colección
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-sage">
                    Únete
                  </p>
                  <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-forest">
                    Regístrate y ahorra
                  </h3>
                </div>

                <Input
                  placeholder="Tu nombre"
                  className="border-forest/15 bg-white/50 focus-visible:ring-sunset"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  disabled={status === "loading"}
                />
                <Input
                  type="email"
                  placeholder="tu@correo.com"
                  className="border-forest/15 bg-white/50 focus-visible:ring-sunset"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === "loading"}
                />

                {status === "error" && (
                  <p className="text-xs text-red-600">{errorMsg}</p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-sunset text-white hover:bg-sunset/85"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando…
                    </>
                  ) : (
                    "Obtener mi descuento"
                  )}
                </Button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full text-xs text-sage underline underline-offset-4 transition-colors hover:text-forest"
                >
                  No, gracias
                </button>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
